import { Router } from "express";
import { usersController } from "../controllers";

export const usersRouter = Router();

usersRouter.route("/register").post(usersController.register);
usersRouter.route("/login").post(usersController.login);
