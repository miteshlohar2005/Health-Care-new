import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Globe, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Section from '../ui/Section';
import NeuralBackground from '../ui/NeuralBackground';
import DNAAnimation from '../ui/DNAAnimation';
import CountUp from '../ui/CountUp';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Section className="relative overflow-hidden pt-6 sm:pt-16 lg:pt-4 pb-20 !bg-transparent">

      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 opacity-20 rounded-full blur-[100px] mix-blend-screen"
        />
        <motion.div
           animate={{ rotate: -360 }}
           transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 opacity-10 rounded-full blur-[100px] mix-blend-screen"
        />
      </div>

      <NeuralBackground />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 w-full pt-4 lg:pt-8 z-10 relative">

        {/* Left Side: DNA Animation (40%) */}
        <div className="w-full lg:w-[40%] flex justify-center order-1 lg:order-1 sm:mb-8 lg:mb-0">
           <div className="relative w-full max-w-[400px]">
             {/* Gradient glow behind DNA */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] bg-teal-500/10 blur-[60px] rounded-full pointer-events-none" />
             <DNAAnimation />
           </div>
        </div>

        {/* Right Side: Text Content (60%) */}
        <div className="w-full lg:w-[60%] text-center lg:text-left order-2 lg:order-2 flex flex-col items-center lg:items-start">
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-sm mb-8 border border-[var(--color-primary)]/20 shadow-lg shadow-blue-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]" />
            </span>
            {t('hero.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="text-white">
              {t('hero.title_start')}
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] filter drop-shadow-sm">
              {t('hero.title_highlight')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl lg:mx-0 mx-auto mb-10 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
          >
            <Button size="lg" onClick={() => navigate('/symptoms')} className="shadow-xl shadow-blue-500/20">
              {t('hero.cta_check_symptoms')} <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/hospitals')}>
              {t('hero.cta_find_hospitals')}
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 mb-4"
          >
            {[
              { icon: Shield, text: "HIPAA Compliant" },
              { icon: Globe, text: "Rural Optimized" },
              { icon: Award, text: "98% Accuracy" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-400">
                <item.icon className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Stats Full Width Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="pt-12 mt-12 border-t border-[var(--color-border)] w-full relative z-10"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
           <div className="text-center">
             <p className="text-3xl sm:text-4xl font-bold text-white mb-1"><CountUp to={10000} />+</p>
             <p className="text-sm text-gray-400">{t('hero.stats.hospitals')}</p>
           </div>
           <div className="text-center">
             <p className="text-3xl sm:text-4xl font-bold text-white mb-1">24/7</p>
             <p className="text-sm text-gray-400">{t('hero.stats.available')}</p>
           </div>
           <div className="text-center">
             <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{t('hero.stats.val_free')}</p>
             <p className="text-sm text-gray-400">{t('hero.stats.lbl_free')}</p>
           </div>
           <div className="text-center">
             <p className="text-3xl sm:text-4xl font-bold text-white mb-1">&lt;<CountUp to={30} />s</p>
             <p className="text-sm text-gray-400">{t('hero.stats.analysis_time')}</p>
           </div>
        </div>
      </motion.div>

    </Section>
  );
};
export default Hero;
