import { Response, Request } from "express";
import { RabbitMQQueue, rabbitmqService, TodosOperation, UsersOperation } from "../services";
import { setRequestTimeout } from "../utils";

class TodosController {
  async index(req: Request, res: Response): Promise<void> {
    setRequestTimeout(10, res);

    const { userId } = req;

    if (userId) {
      await rabbitmqService.sendRequestToServiceAndConsume(
        RabbitMQQueue.Todos,
        TodosOperation.GetAll,
        async (data) => {
          const { status, body, message } = data;
          if (body) {
            res.status(status).send({ todos: body, message });
          } else {
            res.status(status).send({ error: message });
          }
        },
        { userId }
      );
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    setRequestTimeout(10, res);

    const { userId } = req;

    if (userId) {
      const { id } = req.params;

      await rabbitmqService.sendRequestToServiceAndConsume(
        RabbitMQQueue.Todos,
        TodosOperation.Show,
        async (data) => {
          const { status, body, message } = data;

          if (body) {
            res.status(status).send({ todo: body, message });
          } else {
            res.status(status).send({ error: message });
          }
        },
        { id }
      );
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    setRequestTimeout(10, res);

    const { userId } = req;

    if (userId) {
      const { title, description } = req.body;

      await rabbitmqService.sendRequestToServiceAndConsume(
        RabbitMQQueue.Users,
        UsersOperation.GetUserById,
        async (userServiceData) => {
          const { status, body, message } = userServiceData;

          if (body) {
            await rabbitmqService.sendRequestToServiceAndConsume(
              RabbitMQQueue.Todos,
              TodosOperation.Create,
              (todosServiceData) => {
                const { status: todoStatus, body: todo, message: todoMessage } = todosServiceData;

                if (todo) {
                  res.status(todoStatus).send({ todo, message: todoMessage });
                  return;
                }

                res.status(todoStatus).send({ error: todoMessage });
              },
              { title, description, user: body }
            );
          } else {
            res.status(status).send({ error: message });
          }
        },
        { id: userId }
      );
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    setRequestTimeout(10, res);

    const { userId } = req;

    if (userId) {
      const { id } = req.params;
      const updateDto = req.body;

      await rabbitmqService.sendRequestToServiceAndConsume(
        RabbitMQQueue.Todos,
        TodosOperation.Update,
        (data) => {
          const { status, message } = data;
          if (status === 200) {
            res.status(200).send({ message });
          } else {
            res.status(status).send({ error: message });
          }
        },
        { id, ...updateDto }
      );
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    setRequestTimeout(10, res);

    const { userId } = req;

    if (userId) {
      const { id } = req.params;

      await rabbitmqService.sendRequestToServiceAndConsume(
        RabbitMQQueue.Todos,
        TodosOperation.Delete,
        (data) => {
          const { status, message } = data;

          if (status === 200) {
            res.status(200).send({ message });
          } else {
            res.status(status).send({ error: message });
          }
        },
        { id }
      );
    }
  }
}

export const todosController = new TodosController();
