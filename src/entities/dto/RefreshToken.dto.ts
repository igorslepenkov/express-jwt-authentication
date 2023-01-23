import { IsString } from "class-validator";

export class SignRefreshTokenDTO {
  @IsString()
  userId: string;

  @IsString()
  token: string;
}

export class RefreshTokensDTO {
  @IsString()
  token: string;
}
