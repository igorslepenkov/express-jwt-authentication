import { IsString } from "class-validator";

export class SessionDTO {
  @IsString()
  ip: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
