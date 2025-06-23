import { useQuery } from '@tanstack/react-query';
import { backendClient } from '../clients/backend';

export function useBackendAPI<T>(url: string, options?: RequestInit) {
  const query = useQuery({
    queryKey: [url, options],
    queryFn: async () => {
      return backendClient
        .client(url, {
          method: options?.method,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.data as T);
    },
  });

  return query;
}
