export interface IRegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRefreshTokens {
  token: string;
}

export interface IResetPassword {
  newPassword: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IAuthUserSuccess {
  access: string;
  refresh: string;
  message: string;
}

export interface ISignOutUserSuccess {
  message: string;
}

export interface IForgotPasswordSuccess {
  message: string;
}

export interface IUserSession {
  access: string;
  refresh: string;
}
