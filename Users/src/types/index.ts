export * from "./user";

export interface IServiceResponse<T = any> {
  status: number;
  body?: T;
  message?: string;
}
