import { ENV } from '.environments';
import { getAuthToken } from '@components/auth/lib/utils';
import { cookies } from '@lib/utils/cookies';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { IBaseResponse } from 'src/@base/interfaces';

// const headers = {
//   Authorization: `Bearer ${getAuthToken()}`,
// };
export const AxiosInstance = axios.create({
  baseURL: ENV.apiUrl,
  timeout: 15000,
  // headers,
});
AxiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.baseURL = ENV.apiUrl;
    config.headers['Authorization'] = `Bearer ${getAuthToken()}`;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
AxiosInstance.interceptors.response.use(
  (response: AxiosResponse<IBaseResponse>) => {
    return response;
  },
  (error: AxiosError<IBaseResponse>) => {
    if (!error.response) throw error;
    if (typeof window === 'undefined') return error.response;
    if (error?.response?.status === 401) {
      if (window.location.pathname?.startsWith('/user')) {
        cookies.clear();
        window.location.reload();
      }
    } else if (error.response?.data?.success === false) {
      error.response?.data?.errorMessages?.map((x: string) => {
        return toast.error(x, {
          autoClose: 1000,
        });
      });
    }
    return error.response;
  },
);
