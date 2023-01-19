import { Schema, model } from "mongoose";
import { emailRegex } from "../utils";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    match: emailRegex,
    unique: true,
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters length"],
  },
});

export const User = model("User", userSchema);
