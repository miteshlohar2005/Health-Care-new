import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-12' : ''}
            border rounded-xl
            bg-white/10 text-white
            placeholder-gray-400
            border-white/20
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
            hover:border-white/30
            ${error
              ? 'border-red-500/50 bg-red-900/10 focus:ring-red-500/50'
              : ''
            }
          `}
          {...props}
        />
      </div>

      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
