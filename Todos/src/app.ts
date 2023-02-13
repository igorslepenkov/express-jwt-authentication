import "reflect-metadata";
import express from "express";
import { initDatasource } from "./config";
import { TodosOperation, rabbitmqService, IApiRequest, todosService } from "./services";
import { IServiceResponse } from "./types";

const app = express();
const PORT = process.env.PORT ?? 3000;

const handleRequest = async (request: IApiRequest): Promise<IServiceResponse | undefined> => {
  if (request.command === TodosOperation.GetAll) {
    return await todosService.getAll(request.arguments.userId);
  }

  if (request.command === TodosOperation.Show) {
    return await todosService.getOneById(request.arguments.id);
  }

  if (request.command === TodosOperation.Create) {
    const { title, description, user } = request.arguments;
    return await todosService.create({ title, description, user });
  }

  if (request.command === TodosOperation.Update) {
    const { id, title, description } = request.arguments;

    return await todosService.update({ id, title, description });
  }

  if (request.command === TodosOperation.Delete) {
    return await todosService.delete(request.arguments.id);
  }
};

async function initApp(): Promise<void> {
  app.listen(PORT);
  await initDatasource();

  await rabbitmqService.handleApiRequests("Todos", async (data) => {
    const response = await handleRequest(data);
    if (response) {
      return response;
    }
  });

  console.log(`Todos service listening on port ${PORT}`);
}

initApp().catch((err) => {
  console.log(err);
});
