import { JwtPayload } from "jsonwebtoken";

export interface IRefreshToken {
  userId: string;
  token: string;
}

export interface ITokenPayload {
  userId: string;
}

export interface ITokenGeneratorSignResponse {
  access: string;
  refresh: string;
}

export interface ITokenGeneratorIsValidResponse {
  valid: boolean;
  payload: string | JwtPayload;
}
