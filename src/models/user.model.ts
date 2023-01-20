import { Schema, model } from "mongoose";
import { emailRegex } from "../utils";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: emailRegex,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters length"],
    required: true,
  },
});

export const User = model("User", userSchema);
