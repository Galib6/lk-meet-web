import { IBaseEntity, IBaseFilter, IBaseResponse, IdType } from 'src/@base/interfaces';

export interface IEmbassyFilter extends IBaseFilter {
  country?: IdType;
}

export interface IEmbassy extends IBaseEntity {
  title: string;
  orderPriority: number;
}

export interface IEmbassyResponse extends IBaseResponse {
  data: IEmbassy[];
}
