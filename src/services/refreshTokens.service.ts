import { RefreshToken } from "../models";
import { IRefreshToken, IServiceResponse } from "../types";
import { tokenGenerator } from "../utils";

class RefreshTokenService {
  async sign({
    userId,
    token,
  }: IRefreshToken): Promise<IServiceResponse<string>> {
    try {
      const previousToken = await RefreshToken.findOne({ userId });

      let result;

      previousToken
        ? (result = await RefreshToken.updateOne({ userId }, { token }))
        : (result = await RefreshToken.create({ userId, token }));

      if (result) {
        return { status: 200, message: "OK" };
      }

      return { status: 500, message: "Unexpected error" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  async refresh(data: IRefreshToken) {
    const refreshToken = await RefreshToken.findOne(data);

    if (refreshToken) {
      const jwtPack = tokenGenerator.signTokens({ userId: data.userId });

      return { status: 200, body: jwtPack, message: "Token refreshed" };
    }

    return { status: 401, message: "Unrecognized token" };
  }

  async forget(userId: string): Promise<IServiceResponse> {
    try {
      const result = await RefreshToken.findOneAndRemove({ userId });
      if (result) {
        return { status: 200, message: "Sign out successfully" };
      }

      return { status: 400, message: "Bad request" };
    } catch (err: any) {
      return { status: 400, message: "Unexpected error" };
    }
  }
}

export const refreshTokensService = new RefreshTokenService();
