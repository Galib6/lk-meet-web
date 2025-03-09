import { ENV } from '.environments';

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { IBaseResponse } from 'src/@base/interfaces';

// const headers = {
//   Authorization: `Bearer ${getAuthToken()}`,
// };
export const AxiosInstance = axios.create({
  timeout: 15000,
  // headers,
});
AxiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.baseURL = ENV.apiUrl;
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
  async (error: AxiosError<IBaseResponse>) => {
    if (error?.response?.status === 401) {
      if (typeof window === 'undefined') return error.response;
      return error.response;
    } else if (error.response?.data?.success === false) {
      error.response?.data?.errorMessages?.map((_x: string) => {
        // return notification.error({
        //   message: x,
        //   duration: 2,
        // });
      });
    }
    return error.response;
  },
);
