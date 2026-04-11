import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  required = false,
  rows = 4,
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

      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-3 
          border rounded-xl
          bg-white/10 text-white
          placeholder-gray-400
          border-white/20
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
          resize-none
          hover:border-white/30
          ${error
            ? 'border-red-500/50 bg-red-900/10 focus:ring-red-500/50'
            : ''
          }
        `}
        {...props}
      />

      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
