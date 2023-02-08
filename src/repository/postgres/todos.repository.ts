import { Todo } from "../../entities";
import { PostgresRepository } from "./PostgresRepository";

export class TodosRepository extends PostgresRepository<Todo> {
  constructor() {
    super(Todo);
  }
}

export const todosRepository = new TodosRepository();
