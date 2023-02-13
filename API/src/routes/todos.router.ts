import { Router } from "express";
import { makeValidateBody } from "express-class-validator";
import { todosController } from "../controllers/todos.controller";
import { CreateTodoDTO, UpdateTodoDTO } from "../entities/dto";
import { authMiddleware, sessionMiddleware } from "../middleware";

export const todosRouter = Router();

todosRouter
  .route("/")
  .all(authMiddleware)
  .all(sessionMiddleware)
  .get(todosController.index)
  .post(makeValidateBody(CreateTodoDTO))
  .post(todosController.create);

todosRouter
  .route("/:id")
  .all(authMiddleware)
  .all(sessionMiddleware)
  .get(todosController.show)
  .put(makeValidateBody(UpdateTodoDTO))
  .patch(makeValidateBody(UpdateTodoDTO))
  .put(todosController.update)
  .patch(todosController.update)
  .delete(todosController.delete);
