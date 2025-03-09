import { QueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type PromiseValue<T extends Promise<any>> = T extends Promise<infer R> ? R : never;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export type QueryConfig<FetcherFnType extends (...args: any) => any> = UseQueryOptions<
  PromiseValue<ReturnType<FetcherFnType>>
>;

export type MutationConfig<FetcherFnType extends (...args: any) => any> = UseMutationOptions<
  PromiseValue<ReturnType<FetcherFnType>>,
  AxiosError,
  Parameters<FetcherFnType>[0]
>;
