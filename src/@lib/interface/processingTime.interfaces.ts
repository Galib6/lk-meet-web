import { IBaseEntity, IBaseFilter, IBaseResponse, IdType } from 'src/@base/interfaces';

export interface IProcessingTimeFilter extends IBaseFilter {
  country?: IdType;
  visaCategory?: IdType;
}

export interface IProcessingTime extends IBaseEntity {
  title: string;
  description: string;
  orderPriority: number;
}

export interface IProcessingTimeResponse extends IBaseResponse {
  data: IProcessingTime[];
}
