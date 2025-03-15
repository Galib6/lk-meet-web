import { ENUM_MEETING_ENTRY_APPROVAL_STATUS, ENUM_MEETING_SESSION_TYPE } from '@lib/enums';
import { IBaseFilter, IBaseResponse } from 'src/@base/interfaces/interfaces';

export interface IMeetingSessionFilter extends IBaseFilter {}

export interface IMeetingSessionResponse extends IBaseResponse {
  data: IMeetingSession;
}

export interface IParticipantListResponse extends IBaseResponse {
  data: IParticipantList[];
}

export interface IParticipantList {
  name: string;
}
export interface ICountriesResponse extends IBaseResponse {
  data: IMeetingSession[];
}

export interface IRequestSendStatusResponse extends IBaseResponse {
  data: {
    sent: true;
  };
}

export interface ICreateMeetingSession {
  sessionType: ENUM_MEETING_SESSION_TYPE;
}

export interface IChangeRequestPayload {
  roomName: string;
  requestsIds: number[];
  status: ENUM_MEETING_ENTRY_APPROVAL_STATUS;
}

export interface ICreateSessionRequest {
  roomName: string;
}

export interface IMeetingSessionRequest {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  approvalType: string;
  meetingSession: IMeetingSession;
  user: IUser;
  createdById?: any;
  updatedById?: any;
}
interface IUser {
  roles: any[];
  id: number;
  firstName: string;
  lastName?: any;
  fullName?: any;
  avatar: string;
  phoneNumber?: any;
  username?: any;
  email: string;
  authProvider: string;
  isVerified: string;
  isActive: boolean;
  createdById?: any;
  updatedById?: any;
}
interface IMeetingSession {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roomName: string;
  sessionType: string;
  sessionEnded: boolean;
  createdById: number;
  userType: 'admin' | 'participant';
  updatedById?: any;
}

export interface IMeetingSessionRequests extends IBaseResponse {
  data: IMeetingSessionRequest[];
}
