import { IBaseEntity, IBaseFilter, IBaseResponse, IdType } from 'src/@base/interfaces';

export interface ICVCSDFilter extends IBaseFilter {
  country?: IdType;
  visaCategory?: IdType;
  purpose?: IdType;
  document?: IdType;
  providedServices?: IdType;
}

export interface IICVCSDDocument extends IBaseEntity {
  title: string;
  orderPriority: number;
}

export interface IICVCSDNotProvidedService extends IBaseEntity {
  title: string;
  orderPriority: number;
}

export interface IICVCSDProvidedService extends IBaseEntity {
  title: string;
  orderPriority: number;
}

export interface IICVCSDPurpose extends IBaseEntity {
  title: string;
  orderPriority: number;
  isCapital: boolean;
}

export interface IICVCSDVisaCategory extends IBaseEntity {
  title: string;
  orderPriority: number;
}

export interface ICVCSD extends IBaseEntity {
  documents: IICVCSDDocument[];
  providedServices: IICVCSDProvidedService[];
  notProvidedService: IICVCSDNotProvidedService[];
  purpose: IICVCSDPurpose[];
  visaCategories: IICVCSDVisaCategory[];
}

export interface ICVCSDResponse extends IBaseResponse {
  data: ICVCSD;
}
