export interface ISession {
  ip: string;
  accessToken: string;
  refreshToken: string;
}

export interface ISessionValidResponse {
  isValid: true;
  message: string;
  body: ISession;
}

export interface ISessionNotValidResponse {
  isValid: false;
  message: string;
}
