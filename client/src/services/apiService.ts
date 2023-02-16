import axios from "axios";
import {
  IRegisterUser,
  IAuthUserSuccess,
  ILoginUser,
  ISignOutUserSuccess,
  IRefreshTokens,
  IForgotPassword,
  IForgotPasswordSuccess,
  IResetPassword,
  IIndexTodosSuccess,
  ITodoSuccess,
  ICreateTodo,
  IUpdateTodo,
  IUpdateTodoSuccess,
  IDeleteTodoSuccess,
} from "../types";
import { createDinamicUrlString } from "../utils";

enum Endpoint {
  RegisterUser = "users/register",
  LoginUser = "users/login",
  SignOutUser = "users/signOut",
  RefreshTokens = "users/refresh",
  ForgotPas = "users/forgotPas",
  ResetPas = "users/resetPas/:token",
  Todos = "todos",
  Todo = "todos/:id",
}

class ApiService {
  private BASE_URL = process.env.REACT_APP_API_URL!;
  private API = axios.create({ baseURL: this.BASE_URL });

  async registerUser(userData: IRegisterUser): Promise<IAuthUserSuccess> {
    const { data } = await this.API.post<IAuthUserSuccess>(Endpoint.RegisterUser, userData);
    return data;
  }

  async loginUser(userData: ILoginUser): Promise<IAuthUserSuccess> {
    const { data } = await this.API.post<IAuthUserSuccess>(Endpoint.LoginUser, userData);
    return data;
  }

  async signOutUser(userToken: string): Promise<ISignOutUserSuccess> {
    const { data } = await this.API.get<ISignOutUserSuccess>(Endpoint.SignOutUser, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return data;
  }

  async refreshToken(tokenData: IRefreshTokens): Promise<IAuthUserSuccess> {
    const { data } = await this.API.post<IAuthUserSuccess>(Endpoint.RefreshTokens, tokenData);
    return data;
  }

  async forgotPassword(emailData: IForgotPassword): Promise<IForgotPasswordSuccess> {
    const { data } = await this.API.post(Endpoint.ForgotPas, emailData);
    return data;
  }

  async resetPassword(token: string, newPasswordData: IResetPassword): Promise<IAuthUserSuccess> {
    const url = createDinamicUrlString(Endpoint.ResetPas, { token });
    const { data } = await this.API.post<IAuthUserSuccess>(url, newPasswordData);

    return data;
  }

  async indexTodos(userToken: string): Promise<IIndexTodosSuccess> {
    const { data } = await this.API.get<IIndexTodosSuccess>(Endpoint.Todos, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return data;
  }

  async showTodo(id: string, userToken: string): Promise<ITodoSuccess> {
    const url = createDinamicUrlString(Endpoint.Todo, { id });

    const { data } = await this.API.get<ITodoSuccess>(url, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return data;
  }

  async createTodo(todoData: ICreateTodo, userToken: string): Promise<ITodoSuccess> {
    const { data } = await this.API.post<ITodoSuccess>(Endpoint.Todos, todoData, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return data;
  }

  async updateTodo(
    id: string,
    todoData: IUpdateTodo,
    userToken: string
  ): Promise<IUpdateTodoSuccess> {
    const url = createDinamicUrlString(Endpoint.Todo, { id });

    const { data } = await this.API.patch<IUpdateTodoSuccess>(url, todoData, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return data;
  }

  async deleteTodo(id: string, userToken: string): Promise<IDeleteTodoSuccess> {
    const url = createDinamicUrlString(Endpoint.Todo, { id });

    const { data } = await this.API.delete<IDeleteTodoSuccess>(url, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return data;
  }
}

export const apiService = new ApiService();
