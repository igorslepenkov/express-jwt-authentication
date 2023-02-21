import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { modalSlice, sessionsSlice, todosSlice } from "./slices";

export const store = configureStore({
  reducer: {
    todos: todosSlice,
    sessions: sessionsSlice,
    modal: modalSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
