import { Router } from "express";
import { checkSchema } from "express-validator";
import { usersController } from "../controllers";
import { authMiddleware } from "../middleware";
import { loginSchema, registrationSchema, validatorCallback } from "../middleware/validators";

export const usersRouter = Router();

usersRouter
  .route("/register")
  .all(checkSchema(registrationSchema), validatorCallback)
  .post(usersController.register);

usersRouter
  .route("/login")
  .all(checkSchema(loginSchema), validatorCallback)
  .post(usersController.login);

usersRouter.route("/signOut").all(authMiddleware).get(usersController.signOut);

usersRouter.route("/refresh").all(authMiddleware).get(usersController.refreshToken);
