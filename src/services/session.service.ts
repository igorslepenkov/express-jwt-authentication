import { redisRepository } from "../repository";
import { IServiceResponse, ISessionNotValidResponse, ISessionValidResponse } from "../types";
import { SessionDTO } from "../entities/dto";
import { tokenGenerator } from "../utils";

class SessionsService {
  private readonly redisRepository = redisRepository;

  public async sign({ ip, accessToken, refreshToken }: SessionDTO): Promise<IServiceResponse> {
    try {
      const { redisRepository } = this;
      await redisRepository.setSessionData(ip, { ip, accessToken, refreshToken });

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
      const { redisRepository } = this;

      const sessionData = await redisRepository.getSessionData(ip);
      if (sessionData) {
        const { refreshToken: persistedToken } = sessionData;

        if (refreshToken === persistedToken) {
          const jwtPack = tokenGenerator.signTokens({ userId });

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
      const { redisRepository } = this;

      await redisRepository.forgetSessionData(ip);

      return { status: 200, message: "Sign out successfully" };
    } catch (err: any) {
      return { status: 500, message: "Unexpected error" };
    }
  }

  public async validateUserSession(
    ip: string
  ): Promise<ISessionValidResponse | ISessionNotValidResponse> {
    try {
      const { redisRepository } = this;
      const persistedSession = await redisRepository.getSessionData(ip);

      if (persistedSession) return { isValid: true, message: "Ok", body: persistedSession };

      return { isValid: false, message: "Unrecognized session" };
    } catch (err: any) {
      return { isValid: false, message: "Unexpected error" };
    }
  }
}

export const sessionsService = new SessionsService();
