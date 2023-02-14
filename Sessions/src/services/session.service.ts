import { redisService } from "./redis.service";
import { IServiceResponse, ISessionValidationResponse } from "../types";
import { SessionDTO } from "../entities/dto";
import { tokenGenerator } from "../utils";

class SessionsService {
  private readonly redisService = redisService;

  public async sign({ ip, accessToken, refreshToken }: SessionDTO): Promise<IServiceResponse> {
    try {
      const { redisService } = this;
      await redisService.setSessionData(ip, { ip, accessToken, refreshToken });

      return { status: 200, message: "OK" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  public async refresh({
    ip,
    refreshToken,
    userId,
  }: Omit<SessionDTO, "accessToken"> & { userId: string }): Promise<IServiceResponse> {
    try {
      const { redisService } = this;

      const sessionData = await redisService.getSessionData(ip);
      if (sessionData) {
        const { refreshToken: persistedToken } = sessionData;

        if (refreshToken === persistedToken) {
          const jwtPack = tokenGenerator.signTokens({ userId });
          const { access, refresh } = jwtPack;

          await this.redisService.setSessionData(ip, {
            ip,
            accessToken: access,
            refreshToken: refresh,
          });

          return { status: 200, body: jwtPack, message: "Token refreshed" };
        }

        return { status: 401, message: "Unrecognized token" };
      }

      return { status: 401, message: "Session expired" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  public async forget(ip: string): Promise<IServiceResponse> {
    try {
      const { redisService } = this;

      await redisService.forgetSessionData(ip);

      return { status: 200, message: "Sign out successfully" };
    } catch (err: any) {
      return { status: 500, message: "Unexpected error" };
    }
  }

  public async validateUserSession(
    ip: string
  ): Promise<IServiceResponse<ISessionValidationResponse>> {
    try {
      const { redisService } = this;
      const persistedSession = await redisService.getSessionData(ip);

      if (persistedSession)
        return {
          status: 200,
          message: "Ok",
          body: { isValid: true, message: "Ok", session: persistedSession },
        };

      return {
        status: 401,
        message: "Unregonized session",
        body: { isValid: false, message: "Unrecognized session" },
      };
    } catch (err: any) {
      return {
        status: 401,
        message: "Unregonized session",
        body: { isValid: false, message: "Session validation failed" },
      };
    }
  }
}

export const sessionsService = new SessionsService();
