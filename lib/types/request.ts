export enum RET {
  SUCCESS = 0,
  WRONG_PARAMETER = 1,
  SYSTEM_ERROR = 2,
}
export interface Res {
  ret: RET;
  msg?: string;
  data?: Record<string, any> | boolean | string | number;
}
