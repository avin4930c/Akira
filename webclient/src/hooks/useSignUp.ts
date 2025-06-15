import { useRouter } from 'next/navigation';
import { useSignUp as useClerkSignUp } from '@clerk/nextjs';
import { useController, useForm } from 'react-hook-form';
import { create } from 'zustand';
import { zodResolver } from '@hookform/resolvers/zod';

import { otpSchema, signUpSchema, TOtp, TSignUp } from '@/schema/sign-up';

type TSignUpStore = {
  email: string;
  password: string;
  setCredentials: (email: string, password: string) => void;
  clearCredentials: () => void;
};

export const useSignUpStore = create<TSignUpStore>((set) => ({
  email: '',
  password: '',
  setCredentials: (email, password) =>
    set((state) => ({ ...state, email, password })),
  clearCredentials: () =>
    set((state) => ({ ...state, email: '', password: '' })),
}));

export const useSignUp = () => {
  const { password, email, setCredentials } = useSignUpStore();
  const router = useRouter();
  const { isLoaded, signUp } = useClerkSignUp();

  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<TSignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email, password },
  });

  const onSubmit = async ({ email, password }: TSignUp) => {
    // TODO: Add a toast
    if (!isLoaded) return;

    setCredentials(email, password);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      router.push('./verify');
    } catch (err) {
      // TODO: Add a toast
      console.log({ err });
    }
  };

  return {
    register,
    isSubmitting,
    errors,
    handleSubmit: handleSubmit(onSubmit),
  };
};

export const useSignUpVerify = () => {
  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<TOtp>({ resolver: zodResolver(otpSchema) });

  const { field } = useController({ control, name: 'otp' });
  const { isLoaded, signUp, setActive } = useClerkSignUp();
  const router = useRouter();

  const { email, clearCredentials } = useSignUpStore();

  const handleResendOtp = async () => {
    // TODO: Add a toast
    if (!isLoaded) return;
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
  };

  const onSubmit = async ({ otp }: TOtp) => {
    // TODO: Add a toast
    if (!isLoaded) return;

    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: `${otp}`,
    });

    if (signUpAttempt.status === 'complete') {
      await setActive({ session: signUpAttempt.createdSessionId });
      clearCredentials();
      router.replace('/onboarding');
    } else {
      // TODO: Add a toast
      console.error(JSON.stringify(signUpAttempt, null, 2));
    }
  };

  return {
    email,
    field,
    isSubmitting,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    handleResendOtp,
  };
};
