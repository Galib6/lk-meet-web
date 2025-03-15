import { ENV } from '.environments';
import {
  IChangeRequestPayload,
  ICreateMeetingSession,
  ICreateSessionRequest,
  IMeetingSessionResponse,
  IParticipantListResponse,
  IRequestSendStatusResponse,
} from '@lib/interface/meetingSession.interfaces';
import { AxiosInstance } from 'src/@base/config';

import { ErrorHandler } from '@lib/utils/errorHandler';
import { $$ } from '@lib/utils/functions';
import { IBaseResponse } from 'src/@base/interfaces/interfaces';

export const Services = {
  async createSessionRequest(options: ICreateSessionRequest): Promise<IMeetingSessionResponse> {
    try {
      const res = await AxiosInstance.get(`/meeting-sessions/send-req-on-hold?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },

  async sendJoinRequest(payload: ICreateSessionRequest): Promise<IMeetingSessionResponse> {
    try {
      const res = await AxiosInstance.post(`${ENV.apiUrl}/meeting-sessions/send-join-req`, payload);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },

  async findParticipantList(options: ICreateSessionRequest): Promise<IParticipantListResponse> {
    try {
      if (!options?.roomName) return null;
      const res = await AxiosInstance.get(`/meeting-sessions/participant-list?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },

  async findRequestSendStatus(options: ICreateSessionRequest): Promise<IRequestSendStatusResponse> {
    try {
      if (!options?.roomName) return null;
      const res = await AxiosInstance.get(`/meeting-sessions/find-request-send-status?${$$.queryNormalizer(options)}`);
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
