import { Router } from "express";
import { makeValidateBody } from "express-class-validator";
import { usersController } from "../controllers";
import { authMiddleware } from "../middleware";
import { LoginUserDTO, RegisterUserDTO } from "../entities/dto";

export const usersRouter = Router();

usersRouter
  .route("/register")
  .all(makeValidateBody(RegisterUserDTO))
  .post(usersController.register);

usersRouter.route("/login").all(makeValidateBody(LoginUserDTO)).post(usersController.login);

usersRouter.route("/signOut").all(authMiddleware).get(usersController.signOut);

usersRouter.route("/refresh").all(authMiddleware).get(usersController.refreshToken);
