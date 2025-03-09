import { ICVCSDFilter } from '@lib/interface/CVCSD.interface';
import { IEmbassyFilter } from '@lib/interface/embassy.interfaces';
import { IOfficeExceptionalRulesFilter } from '@lib/interface/officeExceptionalRules.interfaces';
import { IProcessingTimeFilter } from '@lib/interface/processingTime.interfaces';
import { IVisaProcessingFeeFilter } from '@lib/interface/visaProcessingFees.interface';
import { Services } from '@lib/services/service';
import { useQuery } from '@tanstack/react-query';
import { IBaseFilter } from 'src/@base/interfaces';
import { QueryConfig } from 'src/@config/react-query/react-query';

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

//---------------- usePurposes hook ------------------------------------
type IUsePurposes = {
  options: IBaseFilter;
  config?: QueryConfig<typeof Services.findPurposes>;
};
export const usePurposes = ({ options, config }: IUsePurposes) => {
  return useQuery({
    ...config,
    queryKey: [Services.findPurposes.name, options],
    queryFn: () => Services.findPurposes(options),
  });
};

//---------------- useVisaCategories hook ------------------------------------
type IUseVisaCategories = {
  options: IBaseFilter;
  config?: QueryConfig<typeof Services.findCountries>;
};
export const useVisaCategories = ({ options, config }: IUseVisaCategories) => {
  return useQuery({
    ...config,
    queryKey: [Services.findVisaCategories.name, options],
    queryFn: () => Services.findVisaCategories(options),
  });
};

//---------------- useProvidedServices hook ------------------------------------
type IUseProvidedServices = {
  options: IBaseFilter;
  config?: QueryConfig<typeof Services.findCountries>;
};
export const useProvidedServices = ({ options, config }: IUseProvidedServices) => {
  return useQuery({
    ...config,
    queryKey: [Services.findProvidedServices.name, options],
    queryFn: () => Services.findProvidedServices(options),
  });
};

//---------------- useCountryVisaCategoryServiceDocumentsServices hook ------------------------------------
type IUseCountryVisaCategoryServiceDocumentsServices = {
  options: ICVCSDFilter;
  config?: QueryConfig<typeof Services.findCountryVisaCategoryServiceDocumentsServices>;
};
export const useCountryVisaCategoryServiceDocumentsServices = ({
  options,
  config,
}: IUseCountryVisaCategoryServiceDocumentsServices) => {
  return useQuery({
    ...config,
    queryKey: [Services.findCountryVisaCategoryServiceDocumentsServices.name, options],
    queryFn: () => Services.findCountryVisaCategoryServiceDocumentsServices(options),
  });
};

//---------------- useProcessingFees hook ------------------------------------
type IUseProcessingFees = {
  options: IVisaProcessingFeeFilter;
  config?: QueryConfig<typeof Services.findVisaProcessingFees>;
};
export const useProcessingFees = ({ options, config }: IUseProcessingFees) => {
  return useQuery({
    ...config,
    queryKey: [Services.findVisaProcessingFees.name, options],
    queryFn: () => Services.findVisaProcessingFees(options),
  });
};

//---------------- useProcessingTime hook ------------------------------------
type IUseProcessingTime = {
  options: IProcessingTimeFilter;
  config?: QueryConfig<typeof Services.findProcessingTime>;
};
export const useProcessingTime = ({ options, config }: IUseProcessingTime) => {
  return useQuery({
    ...config,
    queryKey: [Services.findProcessingTime.name, options],
    queryFn: () => Services.findProcessingTime(options),
  });
};

//---------------- useEmbassies hook ------------------------------------
type IUseEmbassies = {
  options: IEmbassyFilter;
  config?: QueryConfig<typeof Services.findEmbassies>;
};
export const useEmbassies = ({ options, config }: IUseEmbassies) => {
  return useQuery({
    ...config,
    queryKey: [Services.findEmbassies.name, options],
    queryFn: () => Services.findEmbassies(options),
  });
};

//---------------- useEmbassies hook ------------------------------------
type IUseOfficeExceptionalRules = {
  options: IOfficeExceptionalRulesFilter;
  config?: QueryConfig<typeof Services.findOfficeExceptionalRules>;
};
export const useOfficeExceptionalRules = ({ options, config }: IUseOfficeExceptionalRules) => {
  return useQuery({
    ...config,
    queryKey: [Services.findOfficeExceptionalRules.name, options],
    queryFn: () => Services.findOfficeExceptionalRules(options),
  });
};
