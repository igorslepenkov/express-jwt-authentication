import { todosRepository, TodosRepository } from "../repository/postgres";
import { ICreateTodo, IServiceResponse, IUpdateTodo, TodoModel } from "../types";
import { todoMapper } from "../utils/mappers";

class TodosService {
  private readonly todosRepository: TodosRepository = todosRepository;

  async getAll(userId: string): Promise<IServiceResponse<TodoModel[]>> {
    try {
      const records = await this.todosRepository.find({
        relations: { user: true },
        where: { user: { id: userId } },
      });
      if (records !== undefined) {
        return { status: 200, body: records.map((record) => todoMapper(record)), message: "Ok" };
      }

      return { status: 400, message: "Could not get todos" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  async getOneById(todoId: string): Promise<IServiceResponse<TodoModel>> {
    try {
      const record = await this.todosRepository.findOneById(todoId);
      if (record) {
        return {
          status: 200,
          body: todoMapper(record),
          message: "Ok",
        };
      }

      return { status: 404, message: "Could not find todo" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  async create({ title, description, user }: ICreateTodo): Promise<IServiceResponse<TodoModel>> {
    try {
      const { todosRepository } = this;

      const todo = await todosRepository.create({ title, description, user });

      if (todo) {
        return {
          status: 200,
          body: todoMapper(todo),
          message: "Todo created",
        };
      }

      return { status: 400, message: "Could not create todo" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  async update({ id, title, description }: IUpdateTodo): Promise<IServiceResponse> {
    try {
      const { todosRepository } = this;

      const result = await todosRepository.update({ id }, { title, description });

      if (result) {
        return { status: 200, message: "Todo updated" };
      }

      return { status: 400, message: "Could not update todo" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }

  async delete(id: string): Promise<IServiceResponse> {
    try {
      const record = await this.todosRepository.findOneById(id);
      const result = await this.todosRepository.remove(record);

      if (result) {
        return { status: 200, message: "Todo deleted" };
      }

      return { status: 400, message: "Could not delete todo" };
    } catch (err: any) {
      return { status: 500, message: err.message ?? "Unexpected error" };
    }
  }
}

export const todosService = new TodosService();
