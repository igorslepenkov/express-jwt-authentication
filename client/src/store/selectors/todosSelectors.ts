import { createSelector } from "reselect";
import { ITodosSlice } from "../slices";
import { RootState } from "../store";

const selectTodosReducer = (state: RootState): ITodosSlice => state.todos;

export const selectTodos = createSelector([selectTodosReducer], (todosState) => todosState.todos);

export const selectTodosIsLoading = createSelector(
  [selectTodosReducer],
  (todosState) => todosState.isLoading
);

export const selectTodosError = createSelector(
  [selectTodosReducer],
  (todosState) => todosState.error
);

export const selectTodosMessage = createSelector(
  [selectTodosReducer],
  (todosState) => todosState.message
);
