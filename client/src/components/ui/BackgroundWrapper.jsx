import { motion } from 'framer-motion';
import NeuralBackground from './NeuralBackground';

const BackgroundWrapper = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-transparent ${className}`}>
      
      {/* Dynamic Glow Background Gradients */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none fixed">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 opacity-30 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
           animate={{ rotate: -360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 opacity-20 rounded-full blur-[120px] mix-blend-screen"
        />
      </div>

      {/* Reusable Neural Grid/Particles */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
         <NeuralBackground />
      </div>

      {/* Page Content Layers over the background safely */}
      <div className="relative z-10 w-full">
        {children}
      </div>

    </div>
  );
};

export default BackgroundWrapper;
