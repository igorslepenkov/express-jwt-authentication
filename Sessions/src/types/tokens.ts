import { JwtPayload } from "jsonwebtoken";

export interface ITokenGeneratorSignResponse {
  access: string;
  refresh: string;
}

export interface ITokenGeneratorIsValidResponse {
  valid: boolean;
  payload: string | JwtPayload;
}
