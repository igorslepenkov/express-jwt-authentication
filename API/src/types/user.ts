import { User } from "../entities";

export type UserModel = Omit<User, "password">;
