'use client';

import { usePathname } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { hideHeaderPaths } from '@/constants/hideHeaderConstants';
import Link from 'next/link';

const HeaderComponent = () => {
  const pathname = usePathname();
  const hideHeader = hideHeaderPaths.some((path) => pathname.startsWith(path));

  if (hideHeader) {
    return null;
  }

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b bg-white">
      <Link href="/">
        <h1 className="font-semibold text-lg text-black">Akira</h1>
      </Link>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton showName />
      </SignedIn>
    </header>
  );
};

export default HeaderComponent;