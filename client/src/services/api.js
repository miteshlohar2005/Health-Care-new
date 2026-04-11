import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI processing
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    let message = 'Something went wrong. Please try again.';
    
    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please try again.';
    } else if (!error.response) {
      message = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.response.status === 400) {
      message = error.response.data?.message || 'Invalid request. Please check your input.';
    } else if (error.response.status === 500) {
      message = error.response.data?.message || 'Server error. Please try again later.';
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    }

    return Promise.reject(new Error(message));
  }
);

/**
 * Analyze symptoms using AI
 * @param {Object} data - { symptoms: string }
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeSymptoms = async (data) => {
  const response = await api.post('/api/analyze-symptoms', data);
  return response.data;
};

/**
 * Submit follow-up answers for refined analysis
 * @param {Object} data - { original_symptoms, follow_up_answers }
 * @returns {Promise<Object>} Updated analysis
 */
export const submitFollowUp = async (data) => {
  const response = await api.post('/api/follow-up', data);
  return response.data;
};

/**
 * Find nearest hospitals
 * @param {Object} data - { latitude, longitude, limit }
 * @returns {Promise<Object>} Hospital list
 */
export const findNearestHospitals = async (data) => {
  const response = await api.post('/api/hospitals/nearest-hospitals', data);
  return response.data;
};

/**
 * Get all hospitals
 * @returns {Promise<Object>} All hospitals
 */
export const getAllHospitals = async () => {
  const response = await api.get('/api/hospitals');
  return response.data;
};

/**
 * Analyze image using AI
 * @param {FormData} formData - Image file and optional description
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeImage = async (formData) => {
  const response = await api.post('/api/analyze-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000, // 2 minutes for image processing
  });
  return response.data;
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Server status
 */
export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
