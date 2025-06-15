import Image from 'next/image';
import Link from 'next/link';

import { signUpIcons } from '@/resources/icons';
import { OAuthButtons } from '@/components/sign-up/OAuthButtons';

export default function SignUpPage() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Image src={signUpIcons.signUpIcon} alt="Logo" width={335} height={251} />
      <h1 className="text-2xl font-semibold text-gray-800 mt-6 text-center">
        Unlock your true potential
      </h1>
      <p className="text-2xl font-semibold text-gray-800 mb-8">
        Sign up for free.
      </p>
      <p className="text-sm text-[#262D32] text-center mb-8">
        By continuing, you agree to Akira&apos;s{' '}
        {/* TODO: Fill out Terms and Privacy Policy links */}
        <Link href="" className="font-extrabold">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="" className="font-extrabold">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="w-full flex flex-col justify-center items-center space-y-4">
        <OAuthButtons />
        <Link href="./creds" className="w-full max-w-md ">
          <button className="w-full border-2 border-[#0D4671] text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center gap-2">
            <Image
              width={20}
              height={20}
              src={signUpIcons.emailIcon}
              alt="email icon"
            />
            Sign up with email
          </button>
        </Link>
      </div>
      <p className="mt-8 text-gray-600">
        Have an account?{' '}
        <Link href="/sign-in" className="text-[#2A4B82] font-semibold">
          Log in
        </Link>
      </p>
    </div>
  );
}
