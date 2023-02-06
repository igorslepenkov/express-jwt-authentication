export * from "./user";
export * from "./tokens";
export * from "./sessions";

export interface IServiceResponse<T = any> {
  status: number;
  body?: T;
  message?: string;
}
