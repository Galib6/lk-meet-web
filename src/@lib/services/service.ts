import { ICountriesResponse } from '@lib/interface/country.interfaces';
import { ICVCSDFilter, ICVCSDResponse, IICVCSDPurpose } from '@lib/interface/CVCSD.interface';
import { IEmbassyFilter, IEmbassyResponse } from '@lib/interface/embassy.interfaces';
import {
  IOfficeExceptionalRulesFilter,
  IOfficeExceptionalRulesResponse,
} from '@lib/interface/officeExceptionalRules.interfaces';
import { IProcessingTimeFilter, IProcessingTimeResponse } from '@lib/interface/processingTime.interfaces';
import { IVisaProcessingFeeFilter, IVisaProcessingFeeResponse } from '@lib/interface/visaProcessingFees.interface';
import { ErrorHandler } from '@lib/utils/errorHandler';
import { $$ } from '@lib/utils/functions';
import { IBaseFilter, IBaseResponse } from 'src/@base/interfaces';
import { AxiosInstance } from 'src/@config/axios/axios.instance';

export const Services = {
  async findCountries(options: IBaseFilter): Promise<ICountriesResponse> {
    try {
      const res = await AxiosInstance.get(`/countries?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },
  async findPurposes(options: IBaseFilter): Promise<IBaseResponse<IICVCSDPurpose[]>> {
    try {
      const res = await AxiosInstance.get(`/purposes?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },

  async findVisaCategories(options: IBaseFilter): Promise<ICountriesResponse> {
    try {
      const res = await AxiosInstance.get(`/visa-categories?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },

  async findProvidedServices(options: IBaseFilter): Promise<ICountriesResponse> {
    try {
      const res = await AxiosInstance.get(`/provided-services?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },
  async findCountryVisaCategoryServiceDocumentsServices(options: ICVCSDFilter): Promise<ICVCSDResponse> {
    try {
      const res = await AxiosInstance.get(`/country-visa-category-service-documents?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },
  async findVisaProcessingFees(options: IVisaProcessingFeeFilter): Promise<IVisaProcessingFeeResponse> {
    try {
      const res = await AxiosInstance.get(`/visa-processing-fees?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },
  async findProcessingTime(options: IProcessingTimeFilter): Promise<IProcessingTimeResponse> {
    try {
      const res = await AxiosInstance.get(`/processing-time?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },
  async findEmbassies(options: IEmbassyFilter): Promise<IEmbassyResponse> {
    try {
      const res = await AxiosInstance.get(`/embassies?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },
  async findOfficeExceptionalRules(options: IOfficeExceptionalRulesFilter): Promise<IOfficeExceptionalRulesResponse> {
    try {
      const res = await AxiosInstance.get(`/office-exceptional-rules?${$$.queryNormalizer(options)}`);
      return Promise.resolve(res?.data);
    } catch (error) {
      throw ErrorHandler(error);
    }
  },
};
