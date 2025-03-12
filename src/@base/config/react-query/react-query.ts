import { MutationCache, QueryCache, QueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

type PromiseValue<T> = T extends Promise<infer R> ? R : T;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: Error) => {
      return toast.error(error?.message, {
        autoClose: 1000,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: Error) => {
      return toast.error(error?.message, {
        autoClose: 1000,
      });
    },
  }),
});
export type QueryConfig<FetcherFnType extends (...args: any) => any> = UseQueryOptions<
  PromiseValue<ReturnType<FetcherFnType>>
>;

export type MutationConfig<FetcherFnType extends (...args: any) => any> = UseMutationOptions<
  PromiseValue<ReturnType<FetcherFnType>>,
  AxiosError,
  Parameters<FetcherFnType>[0]
>;
