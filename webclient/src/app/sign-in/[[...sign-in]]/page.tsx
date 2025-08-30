"use client";

import { useAuth, useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AuthLayout, SignInForm } from '@/components/auth';

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  const handleEmailSignIn = async (email: string, password: string) => {
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast("Welcome back!", {
          description: "You've been signed in successfully.",
        });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'oauth_google' | 'oauth_apple') => {
    if (!isLoaded) return;

    const providerName = provider === 'oauth_google' ? 'google' : 'apple';
    setSocialLoading(providerName);

    // Set a timeout to reset loading state if redirect takes too long
    const timeoutId = setTimeout(() => {
      setSocialLoading(null);
    }, 10000); // 10 seconds

    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/',
        redirectUrlComplete: '/',
      });
      clearTimeout(timeoutId);
    } catch (err: any) {
      clearTimeout(timeoutId);
      setError(err.errors?.[0]?.message || 'Social sign in failed');
      setSocialLoading(null);
    }
  };

  return (
    <AuthLayout
      title="Welcome back to Akira"
      description="Sign in to your account to continue your ride"
    >
      <SignInForm
        onEmailSignIn={handleEmailSignIn}
        onSocialSignIn={handleSocialSignIn}
        isLoading={isLoading}
        error={error}
        socialLoading={socialLoading}
      />
    </AuthLayout>
  );
}