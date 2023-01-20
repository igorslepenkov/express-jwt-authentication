import bcrypt from "bcryptjs";
import { User } from "../models";
import { IServiceResponse, IUser, UserLogin, UserModel } from "../types";

class UsersService {
  async registerUser(userData: IUser): Promise<IServiceResponse<UserModel>> {
    try {
      await User.validate(userData);

      const user = new User({
        ...userData,
        password: bcrypt.hashSync(userData.password),
      });
      await user.save();

      const { _id, firstName, lastName, email } = user;
      return { status: 200, body: { _id, firstName, lastName, email } };
    } catch (err: any) {
      if ("code" in err && err.code === 11000) {
        return { status: 400, message: "Email already exists" };
      }

      return { status: 400, message: err.message ?? "Unexpected error" };
    }
  }

  async loginUser({ email, password }: UserLogin): Promise<IServiceResponse> {
    try {
      if (!email || !password) throw new Error("Email and password are required");

      const user = await User.findOne({ email });
      if (!user) return { status: 404, message: "Email not found" };

      const isPasswordsEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordsEqual) return { status: 400, message: "Password is incorrect" };

      return { status: 200, body: user, message: "Successfully logged in" };
    } catch (err: any) {
      return { status: 400, message: err.message ?? "Bad request" };
    }
  }

  async signOut(userId: string): Promise<IServiceResponse> {
    try {
      const user = await User.findOne({ _id: userId });

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
