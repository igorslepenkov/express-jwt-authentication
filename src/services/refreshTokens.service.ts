import { RefreshToken } from "../entities";
import { dataSourceManager } from "../config";
import { IServiceResponse } from "../types";
import { tokenGenerator } from "../utils";
import { SignRefreshTokenDTO } from "../entities/dto";

class RefreshTokenService {
  async sign({ userId, token }: SignRefreshTokenDTO): Promise<IServiceResponse<string>> {
    try {
      const previousToken = await dataSourceManager.findOneBy(RefreshToken, { userId });

      if (previousToken) {
        const result = await dataSourceManager.update(RefreshToken, { userId }, { token });

        if (result) {
          return { status: 200, message: "OK" };
        }
      }

      if (!previousToken) {
        const refreshToken = dataSourceManager.create(RefreshToken, { userId, token });
        await dataSourceManager.save(refreshToken);
        return { status: 200, message: "Ok" };
      }

      return { status: 500, message: "Unexpected error" };
    } catch (err: any) {
      console.log(err);
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  async refresh(data: SignRefreshTokenDTO) {
    const refreshToken = await dataSourceManager.findOneBy(RefreshToken, data);

    if (refreshToken) {
      const jwtPack = tokenGenerator.signTokens({ userId: data.userId });

      return { status: 200, body: jwtPack, message: "Token refreshed" };
    }

    return { status: 401, message: "Unrecognized token" };
  }

  async forget(userId: string): Promise<IServiceResponse> {
    try {
      const refreshToken = await dataSourceManager.findOneBy(RefreshToken, { userId });
      const result = await dataSourceManager.remove(refreshToken);
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
