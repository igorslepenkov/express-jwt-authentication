import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { RefreshToken } from "../entities";
import { ITokenGeneratorIsValidResponse, ITokenGeneratorSignResponse } from "../types";

export class TokenGenerator {
  SECRET_KEY: string;

  constructor(secret: string) {
    this.SECRET_KEY = secret;
  }

  signTokens = (payload: Pick<RefreshToken, "userId">): ITokenGeneratorSignResponse => {
    const refreshToken = jwt.sign(payload, this.SECRET_KEY, {
      expiresIn: process.env.REFRESH_EXPIRES_IN ?? "12h",
    });
    const accessToken = jwt.sign(payload, this.SECRET_KEY, {
      expiresIn: process.env.ACCESS_EXPIRES_IN ?? "4h",
    });

    return {
      access: accessToken,
      refresh: refreshToken,
    };
  };

  isValid = (token: string): ITokenGeneratorIsValidResponse => {
    try {
      const payload = jwt.verify(token, this.SECRET_KEY);
      return { valid: true, payload };
    } catch (err: any) {
      if (err instanceof TokenExpiredError) {
        return { valid: false, payload: "Token expired" };
      }

      if (err instanceof JsonWebTokenError) {
        return { valid: false, payload: "Token invalid" };
      }

      if (err instanceof NotBeforeError) {
        return { valid: false, payload: "Token is not active, please wait" };
      }

      return { valid: false, payload: "Unexpected error" };
    }
  };
}

const secretKey = process.env.SECRET_KEY as string;
export const tokenGenerator = new TokenGenerator(secretKey);
