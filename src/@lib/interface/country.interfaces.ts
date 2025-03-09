import { IBaseEntity, IBaseFilter, IBaseResponse } from 'src/@base/interfaces';

export interface ICountryFilter extends IBaseFilter {}

export interface ICountry extends IBaseEntity {
  title: string;
  visaType: string;
  orderPriority: number;
}

export interface ICountryResponse extends IBaseResponse {
  data: ICountry;
}

export interface ICountriesResponse extends IBaseResponse {
  data: ICountry[];
}
