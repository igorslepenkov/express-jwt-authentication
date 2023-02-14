import { IsEmail, Length, IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}

export class LoginUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}

export class ResetPasswordDTO {
  @IsString()
  @Length(6)
  newPassword: string;
}

export class ForgotPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
