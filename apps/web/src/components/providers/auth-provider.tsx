'use client';

import { authClient } from '@/lib/authClient';
import { backendClient } from '@/lib/clients/backend';
import React, { useEffect, useRef, type PropsWithChildren } from 'react';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';

export function AuthProvider({ children }: PropsWithChildren) {
  const isLoading = useRef<boolean>(false);
  const loaded = useDisclosure();

  const refreshToken = async () => {
    if (isLoading.current) return;
    isLoading.current = true;
    await authClient.getSession({
      fetchOptions: {
        onSuccess: ({ response }) => {
          const jwt = response.headers.get('set-auth-jwt');
          backendClient.setToken(jwt || '');
          loaded.onOpen();
        },
        onError: (error) => {
          console.error('Failed to refresh token:', error);
          loaded.onOpen();
        },
      },
    });
    isLoading.current = false;
  };

  useEffect(() => {
    refreshToken();
  }, []);

  if (!loaded.isOpen) return null;

  return <>{children}</>;
}
