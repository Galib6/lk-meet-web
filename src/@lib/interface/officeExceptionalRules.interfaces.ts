import { IBaseEntity, IBaseFilter, IBaseResponse, IdType } from 'src/@base/interfaces';

export interface IOfficeExceptionalRulesFilter extends IBaseFilter {
  country?: IdType;
}

export interface IOfficeExceptionalRules extends IBaseEntity {
  title: string;
  description: string;
  orderPriority: number;
}

export interface IOfficeExceptionalRulesResponse extends IBaseResponse {
  data: IOfficeExceptionalRules[];
}
