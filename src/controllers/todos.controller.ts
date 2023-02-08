import { Response, Request } from "express";
import { todosService, usersService } from "../services";

class TodosController {
  async index(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    if (userId) {
      const { status, body, message } = await todosService.getAll(userId);
      if (body) {
        res.status(status).send({ todos: body });
        return;
      }

      res.status(status).send({ error: message });
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    if (userId) {
      const { id } = req.params;
      const { status, body, message } = await todosService.getOneById(id);

      if (body) {
        res.status(status).send({ todos: body });
        return;
      }

      res.status(status).send({ error: message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    if (userId) {
      const { title, description } = req.body;

      const { status, body, message } = await usersService.getUserById(userId);
      if (body) {
        const {
          status: todoStatus,
          body: todo,
          message: todoMessage,
        } = await todosService.create({ title, description, user: body });

        if (todo) {
          res.status(todoStatus).send({ todo });
          return;
        }

        res.status(todoStatus).send({ error: todoMessage });
        return;
      }

      res.status(status).send({ error: message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    if (userId) {
      const { id } = req.params;
      const updateDto = req.body;

      const { status, message } = await todosService.update({ id, ...updateDto });

      if (status === 200) {
        res.status(200).send({ message });
        return;
      }

      res.status(status).send({ error: message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    if (userId) {
      const { id } = req.params;

      const { status, message } = await todosService.delete(id);

      if (status === 200) {
        res.status(200).send({ message });
        return;
      }

      res.status(status).send({ error: message });
    }
  }
}

export const todosController = new TodosController();
