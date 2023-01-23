import bcrypt from "bcryptjs";
import { User } from "../entities";
import { dataSourceManager } from "../config";
import { IServiceResponse, UserModel } from "../types";
import { LoginUserDTO, RegisterUserDTO } from "../entities/dto";
import { ObjectID } from "typeorm";
import { BaseService } from "./BaseService";

class UsersService extends BaseService<User> {
  constructor() {
    super(User);
  }

  async registerUser(userData: RegisterUserDTO): Promise<IServiceResponse<UserModel>> {
    try {
      const user = await this.repository.create({
        ...userData,
        password: bcrypt.hashSync(userData.password),
      });

      const { password, ...userSafeProperties } = user;

      return { status: 200, body: userSafeProperties };
    } catch (err: any) {
      if ("code" in err && err.code === 11000) {
        return { status: 400, message: "Email already exists" };
      }

      return { status: 400, message: err.message ?? "Unexpected error" };
    }
  }

  async loginUser({ email, password }: LoginUserDTO): Promise<IServiceResponse<UserModel>> {
    try {
      if (!email || !password) throw new Error("Email and password are required");

      const user = await this.repository.findOneByOtherProps({ email });
      if (!user) return { status: 404, message: "Email not found" };

      const isPasswordsEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordsEqual) return { status: 400, message: "Password is incorrect" };

      const { password: unsafePassword, ...userSafeProperties } = user;

      return { status: 200, body: userSafeProperties, message: "Successfully logged in" };
    } catch (err: any) {
      return { status: 400, message: err.message ?? "Bad request" };
    }
  }

  async signOut(userId: string): Promise<IServiceResponse> {
    try {
      const user = await this.repository.findOneById(userId);
      if (user) {
        return { status: 200, message: "OK" };
      }

      return { status: 400, message: "User not found" };
    } catch (err: any) {
      return { status: 400, message: "Unexpected error" };
    }
  }
}

export const usersService = new UsersService();
