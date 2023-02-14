import { RedisCommandArgument } from "@redis/client/dist/lib/commands";
import { createClient, RedisClientType } from "redis";
import { ISession } from "../types";

export enum TimeType {
  Hours = "hours",
  Minutes = "minutes",
  Seconds = "seconds",
}

interface ISetOptions {
  key: string;
  value: RedisCommandArgument;
  timeType: TimeType;
  time: number;
}

class RedisService {
  private readonly client: RedisClientType;
  constructor() {
    this.client =
      process.env.NODE_ENV === "production"
        ? createClient({ url: "redis://redis:6379" })
        : createClient();
  }

  private calculateTimeInSeconds({
    time,
    timeType,
  }: Pick<ISetOptions, "time" | "timeType">): number {
    switch (timeType) {
      case TimeType.Hours:
        return Math.round(time * 3600);
      case TimeType.Minutes:
        return Math.round(time * 60);
      case TimeType.Seconds:
        return time;
    }
  }

  private async set({ key, value, timeType, time }: ISetOptions): Promise<void> {
    const timeInSeconds = this.calculateTimeInSeconds({ time, timeType });
    await this.client.connect();
    await this.client.set(key, value, { EX: timeInSeconds });
    await this.client.disconnect();
  }

  private async get(key: string): Promise<string | null> {
    await this.client.connect();
    const result = await this.client.get(key);
    await this.client.disconnect();

    return result;
  }

  private async deleteKey(key: string): Promise<void> {
    await this.client.connect();
    await this.client.getDel(key);
    await this.client.disconnect();
  }

  public async setSessionData(key: string, value: ISession): Promise<void> {
    const sessionKey = `session/${key}`;
    const refreshTokenExpirationTime = process.env.REFRESH_EXPIRES_IN;

    const timeBeforeExpiration = refreshTokenExpirationTime
      ? Number(refreshTokenExpirationTime.replace("h", ""))
      : 12;

    await this.set({
      key: sessionKey,
      value: JSON.stringify(value),
      timeType: TimeType.Hours,
      time: timeBeforeExpiration,
    });
  }

  public async getSessionData(key: string): Promise<ISession | null> {
    const sessionKey = `session/${key}`;
    const session = await this.get(sessionKey);

    if (session) {
      return JSON.parse(session);
    }

    return null;
  }

  public async forgetSessionData(key: string): Promise<void> {
    const sessionKey = `session/${key}`;

    await this.deleteKey(sessionKey);
  }
}

export const redisService = new RedisService();
