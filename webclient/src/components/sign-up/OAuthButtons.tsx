'use client';

import { useSignIn } from '@clerk/nextjs';
import { ButtonFillWithIcons } from '../common/Buttons/ButtonFill';
import { handleOAuthSignIn } from '@/lib/clerk';

export const OAuthButtons = () => {
  const signIn = useSignIn();

  return (
    <>
      <ButtonFillWithIcons
        onClick={() => handleOAuthSignIn(signIn, 'google', '/onboarding')}
        provider="Google"
      />
      <ButtonFillWithIcons
        onClick={() => handleOAuthSignIn(signIn, 'apple', '/onboarding')}
        provider="Apple"
      />
    </>
  );
};
