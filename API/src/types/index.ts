export * from "./user";
export * from "./tokens";
export * from "./sessions";
export * from "./todo";

export interface IServiceResponse<T = any> {
  status: number;
  body?: T;
  message?: string;
}
