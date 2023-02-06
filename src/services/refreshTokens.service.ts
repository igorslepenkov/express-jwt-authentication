import { IServiceResponse } from "../types";
import { tokenGenerator } from "../utils";
import { SignRefreshTokenDTO } from "../entities/dto";
import { refreshTokensRepository } from "../repository";

class RefreshTokenService {
  private readonly refreshTokensRepository = refreshTokensRepository;

  async sign({ userId, token }: SignRefreshTokenDTO): Promise<IServiceResponse<string>> {
    try {
      const { refreshTokensRepository } = this;

      const previousToken = await refreshTokensRepository.findOneByOtherProps({ userId });
      if (previousToken) {
        const result = await refreshTokensRepository.update({ userId }, { token });

        if (result) {
          return { status: 200, message: "OK" };
        }
      }

      if (!previousToken) {
        await refreshTokensRepository.create({ userId, token });
        return { status: 200, message: "Ok" };
      }

      return { status: 500, message: "Unexpected error" };
    } catch (err: any) {
      console.log(err);
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  async refresh({ userId, token }: SignRefreshTokenDTO): Promise<IServiceResponse> {
    try {
      const { refreshTokensRepository } = this;

      const refreshToken = await refreshTokensRepository.findOneByOtherProps({ userId });
      if (refreshToken && refreshToken.token === token) {
        const jwtPack = tokenGenerator.signTokens({ userId });

        return { status: 200, body: jwtPack, message: "Token refreshed" };
      }

      return { status: 401, message: "Unrecognized token" };
    } catch (err) {
      return { status: 500, message: "Unexpected error" };
    }
  }

  async forget(userId: string): Promise<IServiceResponse> {
    try {
      const { refreshTokensRepository } = this;

      const record = await refreshTokensRepository.findOneByOtherProps({ userId });
      const result = await refreshTokensRepository.remove(record);
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
