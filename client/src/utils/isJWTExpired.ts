import jwt_decode, { JwtPayload } from "jwt-decode";

export const isJWTExpired = (token: string) => {
  if (typeof token !== "string" || !token) throw new Error("Invalid token provided");

  const { exp } = jwt_decode<JwtPayload>(token);

  if (exp) {
    return exp < Date.now() / 1000;
  }

  return false;
};

export class TokenExpiredError extends Error {
  constructor() {
    super("Token is expired");
  }
}
