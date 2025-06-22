import { useQuery } from '@tanstack/react-query';

export function useBackendAPI<T>(url: string, options?: RequestInit) {
  const query = useQuery({
    queryKey: [url, options],
    queryFn: async () => {
      return fetch(['/api/server', url].join(''), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json() as Promise<T>;
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          throw error;
        });
    },
  });

  return query;
}
