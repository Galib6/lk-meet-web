import { ENUM_MEETING_SESSION_TYPE } from '@lib/enums';
import { IBaseEntity, IBaseFilter, IBaseResponse } from 'src/@base/interfaces/interfaces';

export interface IMeetingSessionFilter extends IBaseFilter {}

export interface IMeetingSession extends IBaseEntity {
  title: string;
  visaType: string;
  orderPriority: number;
}

export interface IMeetingSessionResponse extends IBaseResponse {
  data: IMeetingSession;
}

export interface ICountriesResponse extends IBaseResponse {
  data: IMeetingSession[];
}

export interface ICreateMeetingSession {
  sessionType: ENUM_MEETING_SESSION_TYPE;
}
