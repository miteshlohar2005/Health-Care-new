import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold 
    rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 
    focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    whitespace-nowrap
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-[#00f0ff] to-[#00ffa3] text-white font-bold 
      hover:from-teal-400 hover:to-blue-400
      focus-visible:ring-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.6)] 
      hover:shadow-[0_0_30px_rgba(0,255,163,0.8)] border border-white/20
      relative after:absolute after:inset-0 after:rounded-xl after:ring-2 after:ring-white/40 after:animate-pulse
    `,
    secondary: `
      bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400
      focus-visible:ring-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.5)]
      hover:shadow-[0_0_30px_rgba(20,184,166,0.7)] border border-teal-400/20
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400
      focus-visible:ring-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]
      hover:shadow-[0_0_30px_rgba(239,68,68,0.7)]
    `,
    outline: `
      bg-transparent border border-white/20 text-white
      hover:border-white/40 hover:bg-white/5 hover:text-white
      focus-visible:ring-white/50 backdrop-blur-sm
    `,
    ghost: `
      bg-transparent text-gray-300 hover:bg-white/10 hover:text-white
      focus-visible:ring-white/20
    `,
    emergency: `
      bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400
      focus-visible:ring-red-500 animate-pulse
      shadow-[0_0_30px_rgba(239,68,68,0.6)]
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
