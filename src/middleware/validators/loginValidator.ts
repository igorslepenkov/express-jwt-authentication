import { Schema } from "express-validator";

export const loginSchema: Schema = {
  email: {
    isEmail: {},
  },
  password: {
    isLength: {
      errorMessage: "Password must be at least 6 characters length",
      options: { min: 6 },
    },
  },
};
