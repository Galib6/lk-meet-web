import { ICreateSessionRequest } from '@lib/interface/meetingSession.interfaces';
import { Services } from '@lib/services/service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MutationConfig, queryClient, QueryConfig } from 'src/@base/config';

//---------------- useCountry hook ------------------------------------
type IUseCreateSessionRequest = {
  options: ICreateSessionRequest;
  config?: QueryConfig<typeof Services.createSessionRequest>;
};
export const useCreateSessionRequest = ({ options, config }: IUseCreateSessionRequest) => {
  return useQuery({
    ...config,
    queryKey: [Services.createSessionRequest.name, options],
    queryFn: () => Services.createSessionRequest(options),
  });
};

//---------------- useCountry hook ------------------------------------
type IUseFindParticipantList = {
  options: ICreateSessionRequest;
  config?: QueryConfig<typeof Services.findParticipantList>;
};
export const useFindParticipantList = ({ options, config }: IUseFindParticipantList) => {
  return useQuery({
    ...config,
    queryKey: [Services.findParticipantList.name, options],
    queryFn: () => Services.findParticipantList(options),
  });
};

//---------------- useCountry hook ------------------------------------
type IUseFindRequestSendStatus = {
  options: ICreateSessionRequest;
  config?: QueryConfig<typeof Services.findRequestSendStatus>;
};
export const useFindRequestSendStatus = ({ options, config }: IUseFindRequestSendStatus) => {
  return useQuery({
    ...config,
    queryKey: [Services.findRequestSendStatus.name, options],
    queryFn: () => Services.findRequestSendStatus(options),
  });
};

//------------------ useMeetingSessionCreate hook ---------------------------------
type IUseSendJoinRequest = {
  config?: MutationConfig<typeof Services.sendJoinRequest>;
};

export const useSendJoinRequest = ({ config }: IUseSendJoinRequest = {}) => {
  return useMutation({
    ...config,
    mutationFn: Services.sendJoinRequest,
    onSettled: (data) => {
      if (!data?.success) return;
      queryClient.invalidateQueries({
        queryKey: [Services.findRequestSendStatus.name],
      });
    },
  });
};

//------------------ useMeetingSessionCreate hook ---------------------------------
type IUseMeetingSessionCreate = {
  config?: MutationConfig<typeof Services.createMeetingSession>;
};

export const useMeetingSessionCreate = ({ config }: IUseMeetingSessionCreate = {}) => {
  return useMutation({
    ...config,
    mutationFn: Services.createMeetingSession,
    onSettled: (data) => {
      if (!data?.success) return;
    },
  });
};

//---------------- useCountry hook ------------------------------------
type IUseGetRequestList = {
  options: ICreateSessionRequest;
  config?: QueryConfig<typeof Services.getMeetingRequestList>;
};
export const useGetMeetingSessionRequests = ({ options, config }: IUseGetRequestList) => {
  return useQuery({
    ...config,
    queryKey: [Services.getMeetingRequestList.name, options],
    queryFn: () => Services.getMeetingRequestList(options),
  });
};

//------------------ useMeetingSessionCreate hook ---------------------------------
type IUseUpdateSessionRequest = {
  config?: MutationConfig<typeof Services.changeRequestStatus>;
};

export const useUpdateSessionRequest = ({ config }: IUseUpdateSessionRequest = {}) => {
  return useMutation({
    ...config,
    mutationFn: Services.changeRequestStatus,
    onSettled: (data) => {
      if (!data?.success) return;
      queryClient.invalidateQueries({
        queryKey: [Services.getMeetingRequestList.name],
      });
    },
  });
};
