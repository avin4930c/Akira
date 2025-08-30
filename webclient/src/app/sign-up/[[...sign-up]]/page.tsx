"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp, useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { AuthLayout, SignUpForm } from '@/components/auth';

export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  const handleEmailSignUp = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
      toast("Verification email sent!", {
        description: "Please check your email for a verification code.",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (code: string) => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        toast("Welcome to Akira!", {
          description: "Your account has been created successfully.",
        });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'oauth_google' | 'oauth_apple') => {
    if (!isLoaded) return;

    const providerName = provider === 'oauth_google' ? 'google' : 'apple';
    setSocialLoading(providerName);

    // Set a timeout to reset loading state if redirect takes too long
    const timeoutId = setTimeout(() => {
      setSocialLoading(null);
    }, 10000); // 10 seconds

    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/',
        redirectUrlComplete: '/',
      });
      clearTimeout(timeoutId);
    } catch (err: any) {
      clearTimeout(timeoutId);
      setError(err.errors?.[0]?.message || 'Social sign up failed');
      setSocialLoading(null);
    }
  };

  const handleBackToSignUp = () => {
    setPendingVerification(false);
    setError('');
  };

  const title = pendingVerification ? 'Verify your email' : 'Create your Akira account';
  const description = pendingVerification
    ? 'Enter the verification code sent to your email'
    : 'Join Akira today and start your AI-powered ride';

  return (
    <AuthLayout title={title} description={description}>
      <SignUpForm
        onEmailSignUp={handleEmailSignUp}
        onVerification={handleVerification}
        onSocialSignUp={handleSocialSignUp}
        onBackToSignUp={handleBackToSignUp}
        isLoading={isLoading}
        error={error}
        socialLoading={socialLoading}
        pendingVerification={pendingVerification}
      />
    </AuthLayout>
  );
}