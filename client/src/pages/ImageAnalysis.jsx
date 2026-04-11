import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import ImageUpload from '../components/image/ImageUpload';
import ImageAnalysisResult from '../components/image/ImageAnalysisResult';
import BackgroundWrapper from '../components/ui/BackgroundWrapper';
import GradientText from '../components/ui/GradientText';
import { analyzeImage } from '../services/api';

const ImageAnalysis = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [analyzedImage, setAnalyzedImage] = useState(null);

  const handleSubmit = async ({ file, description }) => {
    setLoading(true);
    setResult(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('language', i18n.language);
      if (description) {
        formData.append('description', description);
      }

      // Store image preview
      const reader = new FileReader();
      reader.onload = (e) => setAnalyzedImage(e.target.result);
      reader.readAsDataURL(file);

      const response = await analyzeImage(formData);
      const data = response.data || response;
      setResult(data);

      if (data.medical_attention_recommended) {
        toast.warning('Analysis suggests you should consult a healthcare provider.');
      } else {
        toast.success('Image analysis complete!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setAnalyzedImage(null);
  };

  return (
    <BackgroundWrapper>
      {/* Header */}
      <section className="relative pt-8 sm:pt-12 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl mb-4 shadow-lg shadow-purple-500/10">
              <Camera className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
              <GradientText>{t('image_analysis.title')}</GradientText>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              {t('image_analysis.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Card className="backdrop-blur-xl bg-gray-900/40 border border-[#00f0ff]/20 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
              <Loader message={t('image_analysis.loading')} size="default" />
            </Card>
          ) : result ? (
            <div className="space-y-6">
              <ImageAnalysisResult data={result} image={analyzedImage} />

              <div className="text-center">
                <button
                  onClick={handleNewAnalysis}
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                >
                  ← {t('image_analysis.new_analysis')}
                </button>
              </div>
            </div>
          ) : (
            <Card className="backdrop-blur-xl bg-gray-900/40 border border-[#00f0ff]/20 shadow-[0_0_30px_rgba(0,255,163,0.1)] overflow-hidden">
              <ImageUpload onSubmit={handleSubmit} loading={loading} />
            </Card>
          )}
        </div>
      </section>
    </BackgroundWrapper>
  );
};

export default ImageAnalysis;
