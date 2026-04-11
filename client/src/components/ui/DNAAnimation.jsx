import { motion } from 'framer-motion';

const DNAAnimation = () => {
  return (
    <motion.div 
      className="relative flex items-center justify-center opacity-80 z-10 w-full h-[350px] sm:h-[450px]"
      animate={{ y: [-15, 15, -15] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 0 10px rgba(0, 240, 255, 0.8)) drop-shadow(0 0 20px rgba(0, 255, 163, 0.6))" }}
    >
      {/* Floating particles background effect */}
      {[...Array(12)].map((_, i) => (
        <motion.div
           key={`particle-${i}`}
           className="absolute rounded-full"
           style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              backgroundColor: i % 2 === 0 ? '#00f0ff' : '#00ffa3',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#00f0ff' : '#00ffa3'}`,
           }}
           animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 40 - 20, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
           }}
           transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
           }}
        />
      ))}

      {/* Main 3D DNA Helix */}
      <div className="relative w-48 sm:w-56 lg:w-64 h-full [perspective:1000px] rotate-[-5deg] scale-75 sm:scale-100">
        {[...Array(16)].map((_, i) => {
          const animationDelay = i * -0.25; 
          return (
            <motion.div
              key={i}
              className="absolute top-0 left-1/2 w-full h-1 -translate-x-1/2 flex items-center justify-between"
              style={{ marginTop: `${i * 26}px` }}
              animate={{ rotateY: [0, 360] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                delay: animationDelay
              }}
            >
              {/* Left node */}
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#00f0ff]" />
              
              {/* Connecting strand */}
              <div className="flex-1 h-[2px] bg-gradient-to-r from-[#00f0ff] to-[#00ffa3] opacity-80" />
              
              {/* Right node */}
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#00ffa3]" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DNAAnimation;
