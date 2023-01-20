import { RefreshToken } from "../models";
import { IRefreshToken, IServiceResponse } from "../types";

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
}

export const refreshTokensService = new RefreshTokenService();
