import { Services } from '@lib/services/service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MutationConfig, QueryConfig } from 'src/@base/config';
import { IBaseFilter } from 'src/@base/interfaces/interfaces';

//---------------- useCountry hook ------------------------------------
type IUseCountry = {
  options: IBaseFilter;
  config?: QueryConfig<typeof Services.findCountries>;
};
export const useCountries = ({ options, config }: IUseCountry) => {
  return useQuery({
    ...config,
    queryKey: [Services.findCountries.name, options],
    queryFn: () => Services.findCountries(options),
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
