export interface ITodo {
  id: string;
  title: string;
  description: string;
  createDate: string;
  updateData: string;
}

export interface IIndexTodosSuccess {
  todos: ITodo[];
  message: string;
}

export interface ITodoSuccess {
  todo: ITodo;
  message: string;
}

export interface ICreateTodo {
  title: string;
  description: string;
}

export type IUpdateTodo = Partial<ICreateTodo>;

export interface IUpdateTodoSuccess {
  message: string;
}

export interface IDeleteTodoSuccess {
  message: string;
}
