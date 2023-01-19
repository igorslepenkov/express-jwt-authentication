import { Types } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type UserModel = Omit<IUser, "password"> & { _id: Types.ObjectId };

export type UserLogin = Pick<IUser, "email" | "password">;
