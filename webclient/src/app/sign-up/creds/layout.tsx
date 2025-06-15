'use client';

import { PropsWithChildren } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { publicIcons } from '@/resources/icons';


export default function SignUpStepsLayout({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-center mb-8">
        <button
          onClick={router.back}
          className="p-2 hover:bg-black/5 rounded-full transition-colors" 
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1 flex justify-center items-center mr-8">
          <Image
            src={publicIcons.akiraLogo}
            width={81.6}
            height={24}
            alt="Akira Logo"
          />
        </div>
      </div>
      {children}
    </>
  );
}
