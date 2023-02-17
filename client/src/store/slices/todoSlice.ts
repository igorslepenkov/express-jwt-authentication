import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { apiService } from "../../services";
import {
  ICreateTodo,
  IDeleteTodoSuccess,
  IIndexTodosSuccess,
  ITodo,
  ITodoSuccess,
  IUpdateTodo,
  IUpdateTodoSuccess,
} from "../../types";
import { RootState } from "../store";
import { signOutUser } from "./sessionSlice";

export interface ITodosSlice {
  todos: Array<ITodo>;
  message: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ITodosSlice = {
  todos: [],
  message: null,
  isLoading: false,
  error: null,
};

const fetchTodos = createAsyncThunk<
  IIndexTodosSuccess,
  undefined,
  { rejectValue: string; state: RootState }
>("todos/fetch", async (_, { rejectWithValue, getState }) => {
  try {
    const {
      sessions: { session: currentSession },
    } = getState();

    if (currentSession) {
      return await apiService.indexTodos(currentSession.access);
    }

    return rejectWithValue("User is not signed in");
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const createTodo = createAsyncThunk<
  ITodoSuccess,
  ICreateTodo,
  { rejectValue: string; state: RootState }
>("todos/create", async (data, { rejectWithValue, getState }) => {
  try {
    const {
      sessions: { session: currentSession },
    } = getState();

    if (currentSession) {
      return await apiService.createTodo(data, currentSession.access);
    }

    return rejectWithValue("User is not signed in");
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const updateTodo = createAsyncThunk<
  IUpdateTodoSuccess & IUpdateTodo & { id: string },
  IUpdateTodo & { id: string },
  { rejectValue: string; state: RootState }
>("todos/update", async (data, { rejectWithValue, getState }) => {
  try {
    const {
      sessions: { session: currentSession },
    } = getState();

    if (currentSession) {
      const { id, title, description } = data;
      const result = await apiService.updateTodo(id, { title, description }, currentSession.access);

      return { ...result, id, title, description };
    }

    return rejectWithValue("User is not signed in");
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const deleteTodo = createAsyncThunk<
  IDeleteTodoSuccess & { id: string },
  string,
  { rejectValue: string; state: RootState }
>("todos/delete", async (id, { rejectWithValue, getState }) => {
  try {
    const {
      sessions: { session: currentSession },
    } = getState();

    if (currentSession) {
      const result = await apiService.deleteTodo(id, currentSession.access);

      return { ...result, id };
    }

    return rejectWithValue("User is not signed in");
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchTodos.fulfilled, (state, { payload: { todos, message } }) => {
      state.todos = todos;
    });

    builder.addCase(fetchTodos.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(createTodo.fulfilled, (state, { payload: { todo, message } }) => {
      state.todos.push(todo);
      state.message = message;
    });

    builder.addCase(createTodo.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(
      updateTodo.fulfilled,
      (state, { payload: { id, title, description, message } }) => {
        const todo = state.todos.find((todo) => todo.id === id);

        if (todo) {
          if (title) {
            todo.title = title;
          }

          if (description) {
            todo.description = description;
          }
        }

        state.message = message;
      }
    );

    builder.addCase(updateTodo.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(deleteTodo.fulfilled, (state, { payload: { message, id } }) => {
      const idx = state.todos.findIndex((todo) => todo.id === id);
      state.todos.splice(idx, 1);
      state.message = message;
    });

    builder.addCase(deleteTodo.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addMatcher(
      isPending(fetchTodos, createTodo, updateTodo, deleteTodo, signOutUser),
      (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      }
    );

    builder.addMatcher(isFulfilled(fetchTodos, createTodo, updateTodo, deleteTodo), (state) => {
      state.isLoading = false;
    });

    builder.addMatcher(isRejected(fetchTodos, createTodo, updateTodo, deleteTodo), (state) => {
      state.isLoading = false;
    });
  },
});

export default todosSlice.reducer;
export { fetchTodos, createTodo, updateTodo, deleteTodo };
