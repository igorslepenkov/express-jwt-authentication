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
  IAuthUserSuccess,
  IForgotPassword,
  IForgotPasswordSuccess,
  ILoginUser,
  IRegisterUser,
  IResetPassword,
  ISignOutUserSuccess,
  IUserSession,
} from "../../types";
import { RootState } from "../store";

export interface ISessionSlice {
  session: IUserSession | null;
  message: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ISessionSlice = {
  session: null,
  message: null,
  isLoading: false,
  error: null,
};

const registerUser = createAsyncThunk<
  IAuthUserSuccess,
  IRegisterUser,
  { rejectValue: string; state: RootState }
>("session/register", async (data: IRegisterUser, { rejectWithValue }) => {
  try {
    const result = await apiService.registerUser(data);

    return result;
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const loginUser = createAsyncThunk<
  IAuthUserSuccess,
  ILoginUser,
  { rejectValue: string; state: RootState }
>("session/login", async (data: ILoginUser, { rejectWithValue }) => {
  try {
    const result = await apiService.loginUser(data);

    return result;
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const signOutUser = createAsyncThunk<
  ISignOutUserSuccess,
  undefined,
  { rejectValue: string; state: RootState }
>("session/signOut", async (_, { rejectWithValue, getState }) => {
  try {
    const {
      sessions: { session },
    } = getState();

    if (session) {
      const result = await apiService.signOutUser();

      return result;
    }

    return rejectWithValue("User is not signed in");
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const refreshSession = createAsyncThunk<
  IAuthUserSuccess,
  undefined,
  { rejectValue: string; state: RootState }
>("session/refresh", async (_, { rejectWithValue, getState }) => {
  try {
    const {
      sessions: { session },
    } = getState();

    if (session) {
      const result = await apiService.refreshToken({ token: session.refresh });

      return result;
    }

    return rejectWithValue("User is not signed in");
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const forgotPassword = createAsyncThunk<
  IForgotPasswordSuccess,
  IForgotPassword,
  { rejectValue: string; state: RootState }
>("session/forgotPas", async (data, { rejectWithValue }) => {
  try {
    return await apiService.forgotPassword(data);
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const resetPassword = createAsyncThunk<
  IAuthUserSuccess,
  IResetPassword & { token: string },
  { rejectValue: string; state: RootState }
>("session/resetPas", async (data, { rejectWithValue }) => {
  try {
    const { token, newPassword } = data;

    const result = await apiService.resetPassword(token, { newPassword });

    return result;
  } catch (err: any) {
    if (err instanceof AxiosError && err.response) {
      return rejectWithValue(err.response.data.error);
    }

    return rejectWithValue(err.message);
  }
});

const sessionsSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(registerUser.fulfilled, (state, { payload: { access, refresh, message } }) => {
      state.session = { refresh, access };
      state.message = message;
    });

    builder.addCase(registerUser.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(loginUser.fulfilled, (state, { payload: { access, refresh, message } }) => {
      state.session = { access, refresh };
      state.message = message;
    });

    builder.addCase(loginUser.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(signOutUser.fulfilled, (state, { payload: { message } }) => {
      state.message = message;
      state.session = null;
    });

    builder.addCase(signOutUser.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(resetPassword.fulfilled, (state, { payload: { access, refresh, message } }) => {
      state.session = { access, refresh };
      state.message = message;
    });

    builder.addCase(resetPassword.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(forgotPassword.fulfilled, (state, { payload: { message } }) => {
      state.message = message;
    });

    builder.addCase(forgotPassword.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(
      refreshSession.fulfilled,
      (state, { payload: { access, refresh, message } }) => {
        state.session = { access, refresh };
        state.message = message;
      }
    );

    builder.addCase(refreshSession.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addMatcher(
      isPending(
        registerUser,
        loginUser,
        signOutUser,
        refreshSession,
        resetPassword,
        forgotPassword
      ),
      (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      }
    );

    builder.addMatcher(
      isFulfilled(registerUser, loginUser, signOutUser, resetPassword),
      (state) => {
        state.isLoading = false;
      }
    );

    builder.addMatcher(isRejected(registerUser, loginUser, signOutUser, resetPassword), (state) => {
      state.isLoading = false;
    });
  },
});

export { registerUser, loginUser, signOutUser, resetPassword, forgotPassword, refreshSession };

export default sessionsSlice.reducer;
