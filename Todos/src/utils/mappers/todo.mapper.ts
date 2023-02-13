import { Todo } from "../../entities";
import { TodoModel } from "../../types";

export const todoMapper = (todo: Todo): TodoModel => {
  const { id, title, description, createDate, updateDate } = todo;

  return { id, title, description, createDate, updateDate };
};
