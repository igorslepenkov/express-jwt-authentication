import bcrypt from "bcryptjs";
import { IServiceResponse, UserModel } from "../types";
import { LoginUserDTO, RegisterUserDTO } from "../entities/dto";
import { usersRepository } from "../repository/postgres";
import { User } from "../entities";

class UsersService {
  private readonly usersRepository = usersRepository;

  async registerUser(userData: RegisterUserDTO): Promise<IServiceResponse<UserModel>> {
    try {
      const { usersRepository } = this;

      console.log(userData);

      const user = await usersRepository.create({
        ...userData,
        password: bcrypt.hashSync(userData.password),
      });

      console.log(user);

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
      const { usersRepository } = this;

      if (!email || !password) throw new Error("Email and password are required");

      const user = await usersRepository.findOneByOtherProps({ email });
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
      const { usersRepository } = this;

      const user = await usersRepository.findOneById(userId);
      if (user) {
        return { status: 200, message: "OK" };
      }

      return { status: 400, message: "User not found" };
    } catch (err: any) {
      return { status: 400, message: "Unexpected error" };
    }
  }

  async forgotPassword(email: string): Promise<IServiceResponse> {
    try {
      const user = await this.usersRepository.findOneByOtherProps({ email });

      if (user) {
        return { status: 200, body: user, message: "OK" };
      }

      return { status: 404, message: "User could not be found" };
    } catch (err: any) {
      return { status: 500, message: "Unexpected error" };
    }
  }

  async resetPassword(id: string, newPassword: string): Promise<IServiceResponse> {
    try {
      const result = await this.usersRepository.update(
        { id },
        { password: bcrypt.hashSync(newPassword) }
      );

      if (result) {
        return { status: 200, message: "Password has been reset" };
      }

      return { status: 400, message: "Password could not be reset" };
    } catch (err: any) {
      return { status: 500, message: "Password could not be reset due to unexpected error" };
    }
  }

  async getUserById(id: string): Promise<IServiceResponse<User>> {
    try {
      const user = await this.usersRepository.findOneById(id);
      if (user) {
        return { status: 200, body: user, message: "OK" };
      }

      return { status: 404, message: "User could not be found" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }
}

export const usersService = new UsersService();
