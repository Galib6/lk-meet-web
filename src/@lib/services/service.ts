import { ENV } from '.environments';
import {
  IChangeRequestPayload,
  ICountriesResponse,
  ICreateMeetingSession,
  ICreateSessionRequest,
} from '@lib/interface/meetingSession.interfaces';
import { AxiosInstance } from 'src/@base/config';

import { ErrorHandler } from '@lib/utils/errorHandler';
import { $$ } from '@lib/utils/functions';
import { IBaseResponse } from 'src/@base/interfaces/interfaces';

export const Services = {
  async createSessionRequest(options: ICreateSessionRequest): Promise<ICountriesResponse> {
    try {
      const res = await AxiosInstance.get(`/meeting-sessions/request?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },

  async createMeetingSession(payload: ICreateMeetingSession): Promise<IBaseResponse> {
    try {
      const res = await AxiosInstance.post(`${ENV.apiUrl}/meeting-sessions/create`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },

  async getMeetingRequestList(options: ICreateSessionRequest): Promise<IBaseResponse> {
    try {
      if (!options?.roomName) return null;
      const res = await AxiosInstance.get(`${ENV.apiUrl}/meeting-sessions/request-list?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },

  async changeRequestStatus(payload: IChangeRequestPayload): Promise<IBaseResponse> {
    try {
      const res = await AxiosInstance.post(`${ENV.apiUrl}/meeting-sessions/update-request-status`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },
};
