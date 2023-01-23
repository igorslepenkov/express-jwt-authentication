import { RefreshToken } from "../entities";
import { IServiceResponse } from "../types";
import { tokenGenerator } from "../utils";
import { SignRefreshTokenDTO } from "../entities/dto";
import { BaseService } from "./BaseService";
import { ObjectID } from "typeorm";

class RefreshTokenService extends BaseService<RefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  async sign({ userId, token }: SignRefreshTokenDTO): Promise<IServiceResponse<string>> {
    try {
      const previousToken = await this.repository.findOneByOtherProps({ userId });
      if (previousToken) {
        const result = await this.repository.update({ userId }, { token });

        if (result) {
          return { status: 200, message: "OK" };
        }
      }

      if (!previousToken) {
        await this.repository.create({ userId, token });
        return { status: 200, message: "Ok" };
      }

      return { status: 500, message: "Unexpected error" };
    } catch (err: any) {
      console.log(err);
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  async refresh({ userId, token }: SignRefreshTokenDTO) {
    const refreshToken = await this.repository.findOneByOtherProps({ userId });
    if (refreshToken && refreshToken.token === token) {
      const jwtPack = tokenGenerator.signTokens({ userId });

      return { status: 200, body: jwtPack, message: "Token refreshed" };
    }

    return { status: 401, message: "Unrecognized token" };
  }

  async forget(userId: string): Promise<IServiceResponse> {
    try {
      const record = await this.repository.findOneByOtherProps({ userId });
      const result = await this.repository.remove(record);
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
