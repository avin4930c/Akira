import { useSignIn } from '@clerk/nextjs';

export const handleOAuthSignIn = async (
  { isLoaded, signIn }: ReturnType<typeof useSignIn>,
  provider: 'google' | 'apple',
  callback: string = '/'
) => {
  if (!isLoaded || !signIn) return;
  try {
    await signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}` as const,
      redirectUrl: `${window.location.origin}/sso-callback`,
      redirectUrlComplete: `${window.location.origin}${callback}`,
    });
  } catch (err) {
    // TODO: Add a Toast Maybe
    console.error('OAuth error:', err);
  }
};
