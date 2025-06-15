'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showPasswordToggle?: boolean;
  error?: string;
  fullWidth?: boolean;
}

const InputBox = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className,
      label,
      showPasswordToggle,
      error,
      fullWidth = true,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div
        className={cn(
          'relative group mt-6',
          fullWidth ? 'w-full' : 'w-auto',
          className
        )}
      >
        <div className="relative">
          {label && (
            <label
              className={cn(
                'absolute left-3 transition-all duration-200 pointer-events-none',
                isFocused || hasValue
                  ? '-top-4 -right-5 text-xs'
                  : 'top-3.5 text-base', // Changed from -top-3.5 to -top-6
                error ? 'text-red-500' : 'text-gray-400',
                isFocused ? 'text-blue-500' : ''
              )}
            >
              {label}
            </label>
          )}
          <input
            ref={ref}
            type={
              showPasswordToggle ? (showPassword ? 'text' : 'password') : type
            }
            className={cn(
              'w-full px-4 py-3 rounded-xl border transition-all duration-200',
              'focus:outline-none focus:border-blue-500',
              'placeholder-transparent', // Hide placeholder when label is shown
              error ? 'border-red-500' : 'border-gray-200',
              isFocused ? 'border-blue-500' : '',
              showPasswordToggle ? 'pr-12' : '',
              'text-gray-900 text-base'
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={togglePassword}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'p-2 rounded-full transition-colors',
                'hover:bg-gray-100',
                'focus:outline-none focus:bg-gray-100',
                'text-gray-500'
              )}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

InputBox.displayName = 'InputBox';

export default InputBox;
