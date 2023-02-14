export interface ISession {
  ip: string;
  accessToken: string;
  refreshToken: string;
}

export interface ISessionValidResponse {
  isValid: true;
  message: string;
  session: ISession;
}

export interface ISessionNotValidResponse {
  isValid: false;
  message: string;
}

export type ISessionValidationResponse = ISessionValidResponse | ISessionNotValidResponse;
