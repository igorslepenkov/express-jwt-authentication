import { Schema, model } from "mongoose";
import { IRefreshToken } from "../types";

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: {
    type: String,
    unique: true,
  },
  token: String,
});

export const RefreshToken = model("RefreshToken", refreshTokenSchema);
