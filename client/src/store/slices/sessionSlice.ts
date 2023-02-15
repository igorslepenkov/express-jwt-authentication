import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { apiService } from "../../services";
import {
  IAuthUserSuccess,
  ILoginUser,
  IRegisterUser,
  IResetPassword,
  ISignOutUserSuccess,
  IUserSession,
} from "../../types";
import { RootState } from "../store";

export interface SessionSlice {
  session: IUserSession | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SessionSlice = {
  session: null,
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
    if (typeof err === "string") {
      return rejectWithValue(err);
    }

    if ("error" in err) {
      return rejectWithValue(err.error);
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
    if (typeof err === "string") {
      return rejectWithValue(err);
    }

    if ("error" in err) {
      return rejectWithValue(err.error);
    }

    return rejectWithValue(err.message);
  }
});

const signOutUser = createAsyncThunk<
  ISignOutUserSuccess,
  undefined,
  { rejectValue: string; state: RootState }
>("session/login", async (_, { rejectWithValue, getState }) => {
  try {
    const {
      sessions: { session },
    } = getState();

    if (session) {
      const result = await apiService.signOutUser(session.access);

      return result;
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

const refreshSession = createAsyncThunk<
  IAuthUserSuccess,
  undefined,
  { rejectValue: string; state: RootState }
>("session/login", async (_, { rejectWithValue, getState }) => {
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
    if (typeof err === "string") {
      return rejectWithValue(err);
    }

    if ("error" in err) {
      return rejectWithValue(err.error);
    }

    return rejectWithValue(err.message);
  }
});

const resetPassword = createAsyncThunk<
  IAuthUserSuccess,
  IResetPassword & { token: string },
  { rejectValue: string; state: RootState }
>("session/login", async (data, { rejectWithValue }) => {
  try {
    const { token, newPassword } = data;

    const result = await apiService.resetPassword(token, { newPassword });

    return result;
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

const sessionsSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.session = payload;
    });

    builder.addCase(registerUser.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.session = payload;
    });

    builder.addCase(loginUser.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(signOutUser.fulfilled, (state) => {
      state.session = null;
    });

    builder.addCase(signOutUser.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
      state.session = payload;
    });

    builder.addCase(resetPassword.rejected, (state, { payload }) => {
      if (payload) {
        state.error = payload;
      }
    });

    builder.addCase(refreshSession.fulfilled, (state, { payload }) => {
      state.session = payload;
    });

    builder.addCase(refreshSession.rejected, (state, { payload }) => {
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

export { registerUser, loginUser, signOutUser, resetPassword };

export default sessionsSlice.reducer;
