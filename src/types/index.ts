export * from "./user";
export * from "./tokens";

export interface IServiceResponse<T = any> {
  status: number;
  body?: T;
  message?: string;
}
