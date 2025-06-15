import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'This field is required')
      .email('Entered email is not valid'),
    password: z
      .string()
      .min(1, 'This field is required')
      .min(8, 'Password must be minimum of 8 characters')
      .regex(/[A-Z]/, 'Password must have atleast one Uppercase Alphabet')
      .regex(/[0-9]/, 'Password must have atleast 1 Number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must have atleast 1 Symbol'),
    repeatPassword: z.string().min(1, 'This field is required'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Entered passwords do not match',
    path: ['repeatPassword'],
  });

export const otpSchema = z.object({
  otp: z.coerce.number().min(10000, 'Insuffient OTP Characters').max(999999),
});

export type TSignUp = z.infer<typeof signUpSchema>;
export type TOtp = z.infer<typeof otpSchema>;
