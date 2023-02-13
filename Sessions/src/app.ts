import express from "express";
import { SessionsOperation, sessionsService, rabbitmqService, IApiRequest } from "./services";
import { IServiceResponse } from "./types";

const app = express();

const PORT = process.env.PORT ?? 3000;

const handleRequest = async (request: IApiRequest): Promise<IServiceResponse | undefined> => {
  if (request.command === SessionsOperation.Sign) {
    const { ip, accessToken, refreshToken } = request.arguments;
    return await sessionsService.sign({ ip, accessToken, refreshToken });
  }

  if (request.command === SessionsOperation.Forget) {
    return await sessionsService.forget(request.arguments.ip);
  }

  if (request.command === SessionsOperation.Refresh) {
    const { ip, userId, refreshToken } = request.arguments;
    return await sessionsService.refresh({ ip, userId, refreshToken });
  }

  if (request.command === SessionsOperation.Validate) {
    return await sessionsService.validateUserSession(request.arguments.ip);
  }
};

async function initApp(): Promise<void> {
  app.listen(PORT);
  await rabbitmqService.handleApiRequests("Sessions", async (data) => {
    const response = await handleRequest(data);
    if (response) {
      return response;
    }
  });

  console.log(`Sessions service listening on port ${PORT}`);
}

initApp().catch((err) => {
  console.log(err);
});
