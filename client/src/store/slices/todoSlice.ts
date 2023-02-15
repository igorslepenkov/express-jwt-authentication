import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
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

export interface TodosSlice {
  todos: Array<ITodo>;
  isLoading: boolean;
  error: string | null;
}

const initialState: TodosSlice = {
  todos: [],
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
    if (typeof err === "string") {
      return rejectWithValue(err);
    }

    if ("error" in err) {
      return rejectWithValue(err.error);
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
    if (typeof err === "string") {
      return rejectWithValue(err);
    }

    if ("error" in err) {
      return rejectWithValue(err.error);
    }

    return rejectWithValue(err.message);
  }
});

const updateTodo = createAsyncThunk<
  IUpdateTodoSuccess & IUpdateTodo & { id: string },
  IUpdateTodo & { id: string },
  { rejectValue: string; state: RootState }
>("todos/create", async (data, { rejectWithValue, getState }) => {
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
    if (typeof err === "string") {
      return rejectWithValue(err);
    }

    if ("error" in err) {
      return rejectWithValue(err.error);
    }

    return rejectWithValue(err.message);
  }
});

const deleteTodo = createAsyncThunk<
  IDeleteTodoSuccess & { id: string },
  string,
  { rejectValue: string; state: RootState }
>("todos/create", async (id, { rejectWithValue, getState }) => {
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
    if (typeof err === "string") {
      return rejectWithValue(err);
    }

    if ("error" in err) {
      return rejectWithValue(err.error);
    }

    return rejectWithValue(err.message);
  }
});

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchTodos.fulfilled, (state, { payload }) => {
      state.todos = payload.todos;
    });

    builder.addCase(fetchTodos.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(createTodo.fulfilled, (state, { payload }) => {
      state.todos.push(payload.todo);
    });

    builder.addCase(createTodo.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(updateTodo.fulfilled, (state, { payload: { id, title, description } }) => {
      const todo = state.todos.find((todo) => todo.id === id);

      if (todo) {
        if (title) {
          todo.title = title;
        }

        if (description) {
          todo.description = description;
        }
      }
    });

    builder.addCase(updateTodo.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(deleteTodo.fulfilled, (state, { payload }) => {
      state.todos = state.todos.filter((todo) => todo.id !== payload.id);
    });

    builder.addCase(deleteTodo.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addMatcher(isPending(), (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addMatcher(isFulfilled(), (state) => {
      state.isLoading = false;
    });

    builder.addMatcher(isRejected(), (state) => {
      state.isLoading = false;
    });
  },
});

export default todosSlice.reducer;
