'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type UseFormRegisterReturn, type FieldError } from 'react-hook-form';

import { useSignUp } from '@/hooks/useSignUp';
import { TSignUp } from '@/schema/sign-up';
import { cn } from '@/lib/utils';
import { signUpIcons } from '@/resources/icons';

export default function SignUpCredentialsPage() {
  const { errors, handleSubmit, isSubmitting, register } = useSignUp();

  return (
    <>
      <h2 className="text-[32px] my-8 font-normal text-[#262D32] text-center">
        Setup your email and password
      </h2>

      <form
        onSubmit={handleSubmit}
        className="gap-6 flex justify-center items-center flex-col w-full max-w-md mx-auto"
      >
        <InputWithErrors
          error={errors.email}
          placeholder="Enter Email"
          props={register('email')}
        />
        <InputWithErrors
          error={errors.password}
          placeholder="Enter password"
          props={register('password')}
          showHideIcon
        />
        <InputWithErrors
          placeholder="Re-enter password"
          props={register('repeatPassword')}
          error={errors.repeatPassword}
          showHideIcon
        />

        <p className="text-sm text-center text-[#0D4671] italic mt-4">
          Password should contain at least one all CAPS alphabet, one number
          (0-9), and one symbol.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className={cn(
            'w-full py-4 rounded-[32px] font-normal text-base mt-6 bottom- top-0',
            'text-white bg-figma-primaryDarkBlue',
            'focus:outline-none',
            isSubmitting && 'bg-[#D3D3D3] cursor-not-allowed'
          )}
        >
          Continue
        </button>
      </form>
    </>
  );
}

function InputWithErrors({
  props,
  placeholder,
  showHideIcon = false,
  error,
}: {
  props: UseFormRegisterReturn<keyof TSignUp>;
  placeholder: string;
  showHideIcon?: boolean;
  error?: FieldError;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!showHideIcon);
  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      <div className="bg-white flex justify-between items-center gap-2 w-full p-4 rounded-xl">
        <input
          placeholder={placeholder}
          className={cn(
            'flex-1 h-[20px] text-base outline-none text-[#262D32] placeholder:text-[#B2A897]'
          )}
          {...props}
          type={isPasswordVisible ? 'text' : 'password'}
        />
        {showHideIcon && (
          <button
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            type="button"
            className="pr-2"
          >
            <Image
              width={20}
              height={20}
              src={
                isPasswordVisible
                  ? signUpIcons.eyeOpenIcon
                  : signUpIcons.eyeClosedIcon
              }
              alt="Password Visibility Toggler"
            />
          </button>
        )}
      </div>
      {error?.message && (
        <span className="text-sm text-red-500">{error.message}</span>
      )}
    </div>
  );
}
