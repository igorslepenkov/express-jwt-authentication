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
import { accessInterseptor, createDinamicUrlString } from "../utils";

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
  private PRIVATE_API = axios.create({ baseURL: this.BASE_URL });

  constructor() {
    this.PRIVATE_API.interceptors.request.use(accessInterseptor);
  }

  async registerUser(userData: IRegisterUser): Promise<IAuthUserSuccess> {
    const { data } = await this.API.post<IAuthUserSuccess>(Endpoint.RegisterUser, userData);
    return data;
  }

  async loginUser(userData: ILoginUser): Promise<IAuthUserSuccess> {
    const { data } = await this.API.post<IAuthUserSuccess>(Endpoint.LoginUser, userData);
    return data;
  }

  async signOutUser(): Promise<ISignOutUserSuccess> {
    const { data } = await this.PRIVATE_API.get<ISignOutUserSuccess>(Endpoint.SignOutUser);

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

  async indexTodos(): Promise<IIndexTodosSuccess> {
    const { data } = await this.PRIVATE_API.get<IIndexTodosSuccess>(Endpoint.Todos);

    return data;
  }

  async showTodo(id: string): Promise<ITodoSuccess> {
    const url = createDinamicUrlString(Endpoint.Todo, { id });

    const { data } = await this.PRIVATE_API.get<ITodoSuccess>(url);

    return data;
  }

  async createTodo(todoData: ICreateTodo): Promise<ITodoSuccess> {
    const { data } = await this.PRIVATE_API.post<ITodoSuccess>(Endpoint.Todos, todoData);

    return data;
  }

  async updateTodo(id: string, todoData: IUpdateTodo): Promise<IUpdateTodoSuccess> {
    const url = createDinamicUrlString(Endpoint.Todo, { id });

    const { data } = await this.PRIVATE_API.patch<IUpdateTodoSuccess>(url, todoData);

    return data;
  }

  async deleteTodo(id: string): Promise<IDeleteTodoSuccess> {
    const url = createDinamicUrlString(Endpoint.Todo, { id });

    const { data } = await this.PRIVATE_API.delete<IDeleteTodoSuccess>(url);

    return data;
  }
}

export const apiService = new ApiService();
