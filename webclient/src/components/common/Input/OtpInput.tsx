'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  error?: boolean;
}

const OTPInput = ({ length = 6, onComplete, error }: OTPInputProps) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // If value is entered, move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    const newOtp = [...otp];

    for (let i = 0; i < pasteData.length; i++) {
      if (!isNaN(Number(pasteData[i]))) {
        newOtp[i] = pasteData[i];
      }
    }

    setOtp(newOtp);
    inputRefs.current[Math.min(pasteData.length, length - 1)]?.focus();

    if (pasteData.length === length && onComplete) {
      onComplete(pasteData);
    }
  };

  return (
    <div className="flex gap-1 sm:gap-2 w-full justify-center">
      {otp.map((digit, index) => (
        <div
          key={index}
          className={cn(
            'relative flex-1 max-w-[3rem]',
            error && 'animate-shake'
          )}
        >
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              'w-full aspect-square text-xl text-center',
              'rounded-lg border-2',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200',
              'disabled:bg-gray-50 disabled:text-gray-500',
              digit ? 'border-blue-500' : ''
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default OTPInput;
