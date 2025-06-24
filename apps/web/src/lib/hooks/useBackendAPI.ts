import {
  useQuery,
  type QueryOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { backendClient } from '../clients/backend';

export function useBackendAPI<T>(
  url: string,
  options?: {
    params?: Record<string, any>;
    method?: string;
    query?: Partial<Omit<UseQueryOptions<T>, 'queryFn'>>;
  },
) {
  const query = useQuery<T>({
    ...options?.query,
    queryKey: [url, options],
    queryFn: async () => {
      return backendClient
        .client(url, {
          method: options?.method,
          params: options?.params,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.data as T);
    },
  });

  return query;
}
