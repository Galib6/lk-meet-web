import { ENV } from '.environments';
import { ICountriesResponse, ICreateMeetingSession } from '@lib/interface/meetingSession.interfaces';
import { AxiosInstance } from 'src/@base/config';

import { ErrorHandler } from '@lib/utils/errorHandler';
import { $$ } from '@lib/utils/functions';
import { IBaseFilter, IBaseResponse } from 'src/@base/interfaces/interfaces';

export const Services = {
  async findCountries(options: IBaseFilter): Promise<ICountriesResponse> {
    try {
      const res = await AxiosInstance.get(`/countries?${$$.queryNormalizer(options)}`);
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
};
