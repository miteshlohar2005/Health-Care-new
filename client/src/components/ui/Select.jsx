import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
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
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 pr-10
            border rounded-xl
            bg-white/10 text-white
            border-white/20
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
            appearance-none cursor-pointer
            hover:border-white/30
            ${error
              ? 'border-red-500/50 bg-red-900/10 focus:ring-red-500/50'
              : ''
            }
          `}
          {...props}
        >
          <option value="" disabled className="bg-gray-900 text-gray-400">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-900 text-white">
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
