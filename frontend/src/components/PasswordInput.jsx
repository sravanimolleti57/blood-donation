import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const PasswordInput = ({
  label = 'Password',
  id = 'password',
  name = 'password',
  placeholder = '••••••••',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  helperText,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-brand-600 ml-1">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <FiLock className="w-5 h-5" />
        </div>

        <input
          id={id || name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border text-sm transition-all duration-150 py-2.5 pl-10 pr-10 ${
            error
              ? 'border-brand-500 focus:ring-brand-500 focus:border-brand-500 text-brand-900 bg-red-50/20'
              : 'border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 bg-white'
          } disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
        </button>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-brand-600 flex items-center gap-1 font-medium">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default PasswordInput;
