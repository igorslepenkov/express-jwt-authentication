import { Todo, User } from "../entities";

export interface ICreateTodo {
  title: string;
  description: string;
  user: User;
}

export interface IUpdateTodo {
  id: string;
  title?: string;
  description?: string;
}

export type TodoModel = Omit<Todo, "user">;
