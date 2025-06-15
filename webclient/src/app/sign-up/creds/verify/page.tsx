'use client';

import { InputOTP, InputOTPSlot } from '@/components/ui/input-otp';
import { useSignUpVerify } from '@/hooks/useSignUp';
import { cn } from '@/lib/utils';

export default function VerifyEmailPage() {
  const { errors, handleResendOtp, handleSubmit, isSubmitting, field, email } =
    useSignUpVerify();

  return (
    <>
      <div className="space-y-4 mb-12 mt-16">
        <h2 className="text-[32px] font-normal text-[#262D32] text-center">
          Verify your email
        </h2>
        <p className="text-[#262D32] text-base font-normal text-center">
          Please enter the 6-digit unique code sent to your email -{' '}
          <span className="font-bold">{email}</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto space-y-8 max-w-md"
      >
        <div className="w-full flex justify-center items-center flex-col gap-2">
          <InputOTP
            inputMode="numeric"
            textAlign="center"
            className="w-full"
            value={String(field.value || '')}
            onChange={(val: string) =>
              field.onChange(
                val === '' ? '' : (val.match(/^\d+$/)?.[0] ?? field.value)
              )
            }
            maxLength={6}
          >
            <InputOTPSlot
              className="rounded-xl border-2 border-figma-grayHighlight ring-figma-primaryDarkBlue"
              index={0}
            />
            <InputOTPSlot
              className="rounded-xl border-2 border-figma-grayHighlight ring-figma-primaryDarkBlue"
              index={1}
            />
            <InputOTPSlot
              className="rounded-xl border-2 border-figma-grayHighlight ring-figma-primaryDarkBlue"
              index={2}
            />
            <InputOTPSlot
              className="rounded-xl border-2 border-figma-grayHighlight ring-figma-primaryDarkBlue"
              index={3}
            />
            <InputOTPSlot
              className="rounded-xl border-2 border-figma-grayHighlight ring-figma-primaryDarkBlue"
              index={4}
            />
            <InputOTPSlot
              className="rounded-xl border-2 border-figma-grayHighlight ring-figma-primaryDarkBlue"
              index={5}
            />
          </InputOTP>
          {errors?.otp?.message && (
            <span className="text-xs text-red-500">
              {errors.otp.type === 'invalid_type'
                ? 'Invalid OTP'
                : errors.otp.message}
            </span>
          )}
        </div>

        <button
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          type="button"
          onClick={handleResendOtp}
          className={cn(
            'text-[#E45858] font-medium',
            'hover:text-[#C64242]',
            'focus:outline-none',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          Resend code
        </button>

        <button
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          type="submit"
          className={cn(
            'w-full py-3 px-4 rounded-3xl text-white font-medium',
            'bg-[#0D4671] hover:bg-[#0A3959]',
            isSubmitting && 'opacity-50 cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-[#0D4671]/50'
          )}
        >
          Continue
        </button>
      </form>
    </>
  );
}
