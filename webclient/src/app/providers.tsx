'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { setupInterceptors } from '@/services/api/client';

function ApiInterceptorSetup({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    setupInterceptors(getToken);
  }, [getToken]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ApiInterceptorSetup>{children}</ApiInterceptorSetup>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
