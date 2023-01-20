import { Schema } from "express-validator";

export const registrationSchema: Schema = {
  firstName: {},
  lastName: {},
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
