import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  rightElement,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 tracking-wide">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-xl bg-slate-950/80 border ${
            error ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20'
          } ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${
            rightElement ? 'pr-11' : 'pr-4'
          } py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-400 font-medium pl-1">{error}</p>}
    </div>
  );
};

export default Input;
