import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import SymptomForm from '../components/symptoms/SymptomForm';
import AnalysisResult from '../components/symptoms/AnalysisResult';
import EmergencyAlert from '../components/symptoms/EmergencyAlert';
import BackgroundWrapper from '../components/ui/BackgroundWrapper';
import GradientText from '../components/ui/GradientText';
import { analyzeSymptoms } from '../services/api';

const SymptomChecker = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [currentSymptoms, setCurrentSymptoms] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setResult(null);
    setShowEmergency(false);

    try {
      // Format symptoms text with context
      const symptomsText = `
        Patient Information:
        - Age: ${formData.age} years
        - Gender: ${formData.gender || 'Not specified'}
        - Duration: ${formData.duration || 'Not specified'}
        
        Symptoms:
        ${formData.symptoms}
      `.trim();

      setCurrentSymptoms(symptomsText);

      const response = await analyzeSymptoms({
        symptoms: symptomsText,
        language: i18n.language
      });

      const analysisData = response.data || response;
      setResult(analysisData);

      if (analysisData.emergency) {
        setShowEmergency(true);
        toast.error('Emergency symptoms detected! Please seek immediate medical care.');
      } else if (analysisData.see_doctor) {
        toast.warning('We recommend consulting a healthcare provider.');
      } else {
        toast.success('Analysis complete!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setShowEmergency(false);
    setCurrentSymptoms('');
  };

  const handleFollowUp = async (answers) => {
    setLoading(true);
    try {
      const response = await import('../services/api').then(m => m.submitFollowUp({
        original_symptoms: currentSymptoms,
        follow_up_answers: answers,
        language: i18n.language
      }));

      const analysisData = response.data || response;
      setResult(analysisData);
      toast.success('Analysis updated with new information!');
    } catch (error) {
      console.error('Follow-up error:', error);
      toast.error('Failed to update analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      {/* Emergency Alert */}
      {showEmergency && (
        <EmergencyAlert onClose={() => setShowEmergency(false)} />
      )}

      {/* Header */}
      <section className="relative pt-8 sm:pt-12 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl mb-4 shadow-lg shadow-blue-500/10">
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              <GradientText>{t('symptoms.title')}</GradientText>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              {t('symptoms.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Card className="backdrop-blur-xl bg-gray-900/40 border border-[#00ffa3]/20 shadow-[0_0_30px_rgba(0,255,163,0.1)]">
              <Loader message={t('symptoms.loading')} size="default" />
            </Card>
          ) : result ? (
            <div className="space-y-6">
              <AnalysisResult data={result} onFollowUp={handleFollowUp} isUpdating={loading} />

              <div className="text-center">
                <button
                  onClick={handleNewAnalysis}
                  className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                >
                  ← {t('symptoms.new_analysis')}
                </button>
              </div>
            </div>
          ) : (
            <Card className="backdrop-blur-xl bg-gray-900/40 border border-[#00f0ff]/20 shadow-[0_0_30px_rgba(0,240,255,0.1)] overflow-hidden">
              <SymptomForm onSubmit={handleSubmit} loading={loading} />
            </Card>
          )}
        </div>
      </section>
    </BackgroundWrapper>
  );
};

export default SymptomChecker;
