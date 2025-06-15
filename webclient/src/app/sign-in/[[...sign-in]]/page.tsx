'use client';
import { useState, useEffect } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { ButtonFillWithIcons } from '@/components/common/Buttons/ButtonFill';
import { cn } from '@/lib/utils';
import InputBox from '@/components/common/Input/InputBox';
import { handleOAuthSignIn } from '@/lib/clerk';
import OTPInput from '@/components/common/Input/OtpInput';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState<'email' | 'otp'>('email');
  const [otpError, setOtpError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const sendOTP = async () => {
    if (!isLoaded) return;

    try {
      setIsSubmitting(true);
      setError('');
      setOtpError(false);

      await signIn.create({
        identifier: email,
        strategy: 'email_code',
      });

      setStage('otp');
      setResendCooldown(60);
    } catch (err: Error | unknown) {
      console.error('OTP Send Error:', err);
      if (err && typeof err === 'object' && 'errors' in err) {
        setError(
          (err as { errors: { message: string }[] }).errors[0]?.message ||
            'Failed to send OTP. Please try again.'
        );
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    await sendOTP();
  };

  const handleVerifyOTP = async () => {
    if (!isLoaded || otp.length !== 6) return;

    try {
      setIsVerifying(true);
      setOtpError(false);
      setError('');

      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: otp,
      });

      await setActive({ session: signInAttempt.createdSessionId });
      router.push('/');
    } catch (err: Error | unknown) {
      console.error('OTP Verification Error:', err);
      setOtpError(true);
      if (err && typeof err === 'object' && 'errors' in err) {
        setError(
          (err as { errors: { message: string }[] }).errors[0]?.message ||
            'Invalid OTP. Please try again.'
        );
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#92E1E2] via-[#DBE7CD] to-[#FFBE98] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-lg p-8 space-y-8 shadow-lg"
      >
        <AnimatePresence mode="wait">
          {stage === 'email' ? (
            <motion.div
              key="email-stage"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  Sign in to Akira
                </h1>
                <p className="mt-2 text-gray-600">
                  Welcome back! Please sign in to continue
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <ButtonFillWithIcons
                  provider="Apple"
                  onClick={() =>
                    handleOAuthSignIn(
                      { signIn, isLoaded, setActive } as ReturnType<
                        typeof useSignIn
                      >,
                      'apple'
                    )
                  }
                />
                <ButtonFillWithIcons
                  provider="Google"
                  onClick={() =>
                    handleOAuthSignIn(
                      { signIn, isLoaded, setActive } as ReturnType<
                        typeof useSignIn
                      >,
                      'google'
                    )
                  }
                />
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <InputBox
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your email"
                    error={error}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={cn(
                    'w-full flex justify-center py-3 px-4 border-2 border-[#0D4671] rounded-2xl',
                    'text-[#0D4671] hover:bg-[#0D4671]/90 hover:text-white transition-colors',
                    'relative disabled:opacity-50 disabled:cursor-not-allowed',
                    isSubmitting ? 'bg-[#0D4671]/90 text-white' : ''
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Continue with Email'
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="otp-stage"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Enter Verification Code
                </h2>
                <p className="mt-2 text-gray-600">
                  A 6-digit code has been sent to {email}
                </p>
              </div>

              <OTPInput
                length={6}
                onComplete={(value) => setOtp(value)}
                error={otpError}
              />

              {error && (
                <p className="mt-2 text-sm text-red-500 animate-pulse">
                  {error}
                </p>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || isVerifying}
                className={cn(
                  'w-full flex justify-center py-3 px-4 border-2 border-[#0D4671] rounded-2xl',
                  'text-[#0D4671] hover:bg-[#0D4671]/90 hover:text-white transition-colors',
                  'relative disabled:opacity-50 disabled:cursor-not-allowed',
                  isVerifying ? 'bg-[#0D4671]/90 text-white' : ''
                )}
              >
                {isVerifying ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify Code'
                )}
              </button>
              <div className="mt-4 flex justify-center items-center space-x-2">
                <p className="text-sm text-gray-600">
                  Didn&apos;t receive the code?
                </p>
                <button
                  onClick={sendOTP}
                  disabled={resendCooldown > 0}
                  className={cn(
                    'text-sm hover:underline',
                    resendCooldown > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600'
                  )}
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
