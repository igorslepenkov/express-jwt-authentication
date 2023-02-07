import { Router } from "express";
import { makeValidateBody } from "express-class-validator";
import { usersController } from "../controllers";
import { authMiddleware, sessionModdleware } from "../middleware";
import {
  ForgotPasswordDTO,
  LoginUserDTO,
  RefreshTokensDTO,
  RegisterUserDTO,
  ResetPasswordDTO,
} from "../entities/dto";

export const usersRouter = Router();

usersRouter
  .route("/register")
  .all(makeValidateBody(RegisterUserDTO))
  .post(usersController.register);

usersRouter.route("/login").all(makeValidateBody(LoginUserDTO)).post(usersController.login);

usersRouter
  .route("/signOut")
  .all(authMiddleware)
  .all(sessionModdleware)
  .get(usersController.signOut);

usersRouter
  .route("/refresh")
  .all(makeValidateBody(RefreshTokensDTO))
  .post(usersController.refreshToken);

usersRouter
  .route("/forgotPas")
  .all(makeValidateBody(ForgotPasswordDTO))
  .post(usersController.forgotPassword);

usersRouter
  .route("/resetPas/:token")
  .get(usersController.getResetPassword)
  .post(makeValidateBody(ResetPasswordDTO))
  .post(usersController.postResetPassword);
