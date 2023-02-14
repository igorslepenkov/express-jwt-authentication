import "reflect-metadata";
import express from "express";
import { initDatasource } from "./config";
import { UsersOperation, rabbitmqService, IApiRequest, usersService } from "./services";
import { IServiceResponse } from "./types";

const app = express();
const PORT = process.env.PORT ?? 3000;

const handleRequest = async (request: IApiRequest): Promise<IServiceResponse | undefined> => {
  if (request.command === UsersOperation.Register) {
    const { firstName, lastName, email, password } = request.arguments;
    return await usersService.registerUser({ firstName, lastName, email, password });
  }

  if (request.command === UsersOperation.Login) {
    const { email, password } = request.arguments;

    return await usersService.loginUser({ email, password });
  }

  if (request.command === UsersOperation.SignOut) {
    return await usersService.signOut(request.arguments.userId);
  }

  if (request.command === UsersOperation.GetUserById) {
    return await usersService.getUserById(request.arguments.id);
  }

  if (request.command === UsersOperation.ForgotPas) {
    return await usersService.forgotPassword(request.arguments.email);
  }

  if (request.command === UsersOperation.ResetPas) {
    const { id, newPassword } = request.arguments;
    return await usersService.resetPassword(id, newPassword);
  }
};

async function initApp(): Promise<void> {
  app.listen(PORT);
  await initDatasource();

  setTimeout(async () => {
    await rabbitmqService.handleApiRequests("Users", async (data) => {
      const response = await handleRequest(data);
      if (response) {
        return response;
      }
    });
  }, 1000);

  console.log(`Users service listening on port ${PORT}`);
}

initApp().catch((err) => {
  console.log(err);
});
