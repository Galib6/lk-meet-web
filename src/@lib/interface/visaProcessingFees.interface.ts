import { IBaseEntity, IBaseFilter, IBaseResponse, IdType } from 'src/@base/interfaces';

export interface IVisaProcessingFeeFilter extends IBaseFilter {
  country?: IdType;
  visaCategory?: IdType;
}

export interface IIVisaProcessingFee extends IBaseEntity {
  title: string;
  orderPriority: number;
  visaProcessingFeeTypes: {
    visaProcessingFeeType: {
      title: string;
    };
    amount: number;
  }[];
}

export interface IVisaProcessingFeeResponse extends IBaseResponse {
  data: IIVisaProcessingFee[];
}
