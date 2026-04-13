/**
 * Gemini AI Service
 * Handles all interactions with Google's Gemini API for medical symptom analysis
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

class GeminiService {
  constructor() {
    if (!config.GEMINI_API_KEY) {
      console.warn('⚠️  WARNING: GEMINI_API_KEY not configured. AI features will not work.');
      this.genAI = null;
      this.model = null;
      this.visionModel = null;
    } else {
      this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
      // Primary: gemini-1.5-flash (stable), fallback: gemini-1.5-pro
      this.modelName = 'gemini-1.5-flash';
      this.fallbackModelName = 'gemini-1.5-pro';
      this.model = this.genAI.getGenerativeModel({ model: this.modelName });
      this.visionModel = this.genAI.getGenerativeModel({ model: this.modelName });
    }

    // System prompt with medical safety guardrails
    this.systemPrompt = `You are an AI healthcare screening assistant for rural communities.

CRITICAL RULES:
- You are NOT a doctor and cannot provide medical diagnosis
- You CANNOT prescribe medications
- Use simple, clear language suitable for non-medical users
- Always encourage users to visit a doctor when needed
- Clearly mark emergency situations
- Provide general health guidance only
- Include disclaimers about not replacing professional medical advice

YOUR ROLE:
- Analyze symptoms described by the user
- Identify possible common causes (not diagnosis)
- Assess severity level (mild, moderate, severe, emergency)
- Provide safe, general care advice
- Ask relevant follow-up questions
- Recommend doctor visit when appropriate

EMERGENCY SYMPTOMS (always flag as emergency):
- Chest pain or pressure
- Difficulty breathing or shortness of breath
- Severe bleeding
- Loss of consciousness
- Severe allergic reactions
- Stroke symptoms (facial drooping, arm weakness, speech difficulty)
- Severe abdominal pain
- High fever with confusion
- Severe head injury
- Suicidal thoughts

FORMAT YOUR RESPONSE AS JSON with these fields:
{
  "possible_causes": ["list of possible common causes"],
  "severity": "mild|moderate|severe|emergency",
  "care_advice": "safe self-care suggestions",
  "doctor_visit_needed": true/false,
  "emergency": true/false,
  "follow_up_questions": ["relevant questions to ask"],
  "disclaimer": "Standard medical disclaimer"
}

Remember: When in doubt, recommend medical consultation.`;
  }

  /**
   * Generate content with automatic retry and model fallback on 503
   */
  async generateWithRetry(parts, useVision = false) {
    const maxRetries = 2;
    const models = [this.modelName, this.fallbackModelName];

    for (const modelName of models) {
      const model = this.genAI.getGenerativeModel({ model: modelName });
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const result = await model.generateContent(parts);
          return result;
        } catch (err) {
          const is503 = err.message?.includes('503') || err.message?.includes('Service Unavailable') || err.message?.includes('overloaded');
          if (is503 && attempt < maxRetries) {
            console.warn(`Model ${modelName} returned 503, retrying (${attempt}/${maxRetries})...`);
            await new Promise(r => setTimeout(r, 1500 * attempt));
            continue;
          }
          if (is503 && modelName !== this.fallbackModelName) {
            console.warn(`Model ${modelName} unavailable, switching to fallback...`);
            break; // try next model
          }
          throw err;
        }
      }
    }
  }

  /**
   * Check if Gemini API is configured
   */
  isConfigured() {
    return this.model !== null;
  }

  /**
   * Helper to get language name from code
   */
  getLanguageName(code) {
    const languages = {
      'en': 'English',
      'hi': 'Hindi',
      'mr': 'Marathi',
      'bn': 'Bengali'
    };
    return languages[code] || 'English';
  }

  /**
   * Analyze symptoms using Gemini AI
   * @param {Object} symptomData - {age, gender, symptoms, duration, language}
   * @returns {Object} Analysis result
   */
  async analyzeSymptoms(symptomData) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in .env file');
    }

    const { age, gender, symptoms, duration, language } = symptomData;
    const targetLanguage = this.getLanguageName(language);

    // Validate input
    if (!symptoms || symptoms.trim() === '') {
      throw new Error('Symptoms are required');
    }

    // Build user prompt
    const userPrompt = `
Patient Information:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Symptoms: ${symptoms}
- Duration: ${duration || 'Not specified'}

Please analyze these symptoms and provide a structured response following the JSON format specified in your instructions.
IMPORTANT: Provide the response content in ${targetLanguage}. 
However, you MUST keep the JSON property keys (possible_causes, severity, care_advice, etc.) in English. Only translate the values/descriptions.
`;

    try {
      // Generate content with retry and fallback
      const result = await this.generateWithRetry([
        this.systemPrompt,
        userPrompt
      ]);

      const response = result.response;
      const text = response.text();

      // Try to parse JSON response
      let parsedResponse;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
          text.match(/```\s*([\s\S]*?)\s*```/) ||
          [null, text];
        parsedResponse = JSON.parse(jsonMatch[1] || text);
      } catch (parseError) {
        // If JSON parsing fails, create a structured response
        parsedResponse = {
          possible_causes: [text.substring(0, 200)],
          severity: 'unknown',
          care_advice: text,
          doctor_visit_needed: true,
          emergency: false,
          follow_up_questions: [],
          disclaimer: 'This is AI-generated information and not a medical diagnosis. Please consult a healthcare professional.'
        };
      }

      // Add default disclaimer if not present
      if (!parsedResponse.disclaimer) {
        parsedResponse.disclaimer = 'This AI screening is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.';
      }

      return parsedResponse;

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze follow-up answers to refine diagnosis
   * @param {Object} data - { original_symptoms, follow_up_answers, language }
   * @returns {Object} Refined analysis result
   */
  async analyzeFollowUp(data) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API is not configured');
    }

    const { original_symptoms, follow_up_answers, language } = data;
    const targetLanguage = this.getLanguageName(language);

    const userPrompt = `
PREVIOUS CONTEXT:
Patient Symptoms: ${original_symptoms}

FOLLOW-UP Q&A:
${follow_up_answers}

INSTRUCTIONS:
Based on the original symptoms AND the new information provided in the follow-up answers, please provide a REFINED and MORE SPECIFIC analysis.
Update the possible causes, severity, and advice based on these new details.

Format response as the same JSON structure as before:
{
  "possible_causes": ["refined list of causes"],
  "severity": "mild|moderate|severe|emergency",
  "care_advice": "updated specific advice",
  "doctor_visit_needed": true/false,
  "emergency": true/false,
  "follow_up_questions": ["new questions if needed, or empty if clear"],
  "disclaimer": "Standard medical disclaimer"
}

IMPORTANT: Provide the response content in ${targetLanguage}. 
However, you MUST keep the JSON property keys in English. Only translate the values.
`;

    try {
      const result = await this.generateWithRetry([
        this.systemPrompt,
        userPrompt
      ]);

      const response = result.response;
      const text = response.text();

      let parsedResponse;
      try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
          text.match(/```\s*([\s\S]*?)\s*```/) ||
          [null, text];
        parsedResponse = JSON.parse(jsonMatch[1] || text);
      } catch (e) {
        parsedResponse = {
          possible_causes: ["Could not parse refined analysis"],
          severity: "unknown",
          care_advice: text,
          doctor_visit_needed: true,
          emergency: false,
          follow_up_questions: [],
          disclaimer: "Analysis error. Please consult a doctor."
        };
      }

      if (!parsedResponse.disclaimer) {
        parsedResponse.disclaimer = 'This AI screening is not a substitute for professional medical advice.';
      }

      return parsedResponse;

    } catch (error) {
      console.error('Gemini Follow-up Error:', error);
      throw new Error(`Follow-up analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze medical image using Gemini Vision
   * @param {Buffer} imageBuffer - Image file buffer
   * @param {String} mimeType - Image MIME type
   * @param {String} language - Target language code
   * @returns {Object} Analysis result
   */
  async analyzeImage(imageBuffer, mimeType, language) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in .env file');
    }

    const targetLanguage = this.getLanguageName(language);

    const imagePrompt = `You are a medical screening assistant analyzing an image.

IMPORTANT RULES:
- Describe what you see objectively
- Do NOT provide medical diagnosis
- Do NOT identify specific diseases
- Suggest seeking medical attention if anything concerning is visible
- Use simple, non-alarming language
- Include a disclaimer

Please analyze this image and provide:
1. Description of visible symptoms or conditions
2. Whether this appears to need medical attention
3. General advice
4. Disclaimer

Format as JSON:
{
  "description": "what is visible in the image",
  "concerns": ["list any visible concerns"],
  "medical_attention_recommended": true/false,
  "advice": "general guidance",
  "disclaimer": "standard disclaimer"
}

IMPORTANT: Provide the response content in ${targetLanguage}. 
However, you MUST keep the JSON property keys in English. Only translate the values.
`;

    try {
      // Convert buffer to base64
      const base64Image = imageBuffer.toString('base64');

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      };

      const result = await this.generateWithRetry([imagePrompt, imagePart]);
      const response = result.response;
      const text = response.text();

      // Parse JSON response
      let parsedResponse;
      try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
          text.match(/```\s*([\s\S]*?)\s*```/) ||
          [null, text];
        parsedResponse = JSON.parse(jsonMatch[1] || text);
      } catch (parseError) {
        parsedResponse = {
          description: text,
          concerns: [],
          medical_attention_recommended: true,
          advice: 'Please consult with a healthcare professional for proper evaluation.',
          disclaimer: 'This AI analysis is not a medical diagnosis.'
        };
      }

      // Add default disclaimer if not present
      if (!parsedResponse.disclaimer) {
        parsedResponse.disclaimer = 'This image analysis is not a substitute for professional medical diagnosis. Please consult a healthcare provider for proper evaluation.';
      }

      return parsedResponse;

    } catch (error) {
      console.error('Gemini Image Analysis Error:', error);
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  /**
   * Get emergency keywords for quick detection
   */
  getEmergencyKeywords() {
    return [
      'chest pain',
      'can\'t breathe',
      'difficulty breathing',
      'severe bleeding',
      'unconscious',
      'not breathing',
      'heart attack',
      'stroke',
      'seizure',
      'severe allergic reaction',
      'anaphylaxis',
      'suicide',
      'severe burn',
      'poisoning',
      'overdose'
    ];
  }

  /**
   * Quick emergency detection before AI call
   * @param {String} symptoms - Symptom description
   * @returns {Boolean} True if emergency keywords detected
   */
  quickEmergencyCheck(symptoms) {
    const lowerSymptoms = symptoms.toLowerCase();
    const emergencyKeywords = this.getEmergencyKeywords();

    return emergencyKeywords.some(keyword =>
      lowerSymptoms.includes(keyword)
    );
  }
}

// Export singleton instance
const geminiService = new GeminiService();
module.exports = geminiService;
