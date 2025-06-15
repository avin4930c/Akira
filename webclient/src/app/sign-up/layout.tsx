import { PropsWithChildren } from 'react';

export default function SignUpLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#92E1E2] via-[#DBE7CD] to-[#FFBE98] p-6">
      {children}
    </div>
  );
}
