import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";
import { IServiceResponse } from "../types";

export enum RabbitMQQueue {
  Api = "api",
  Sessions = "sessions",
  Todos = "todos",
  Users = "users",
}

export enum SessionsOperation {
  Sign = "sign",
  Forget = "forget",
  Refresh = "refresh",
  Validate = "validate",
}

export enum TodosOperation {
  Create = "create",
  GetAll = "getAll",
  Show = "show",
  Update = "update",
  Delete = "delete",
}

export enum UsersOperation {
  Register = "register",
  GetUserById = "getUserById",
  Login = "login",
  SignOut = "signOut",
  ForgotPas = "forgotPas",
  ResetPas = "resetPas",
}

export type Operation = SessionsOperation | TodosOperation | UsersOperation;

interface IQueueListenerOptions {
  simultaneous: boolean;
}

export interface IApiRequest {
  command: Operation;
  arguments: Record<string, any>;
}

export type Service = keyof typeof RabbitMQQueue;

class RabbitMQService {
  private static connection: amqp.Connection;

  private static channel: amqp.Channel;

  private static async init(): Promise<void> {
    const host = process.env.NODE_ENV === "production" ? "rabbitmq" : "localhost";

    RabbitMQService.connection =
      RabbitMQService.connection ??
      (await amqp.connect(`amqp://${host}:${process.env.RABBIT_MQ_PORT}`));

    RabbitMQService.channel =
      RabbitMQService.channel ?? (await RabbitMQService.connection.createChannel());
  }

  private async sendToQueue(
    queue: RabbitMQQueue,
    msg: any,
    { correlationId, replyTo }: amqp.Options.Publish
  ): Promise<void> {
    await RabbitMQService.init();
    const { channel } = RabbitMQService;

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { correlationId, replyTo });
  }

  private async addQueueListener(
    queue: RabbitMQQueue,
    callback: (data: amqp.ConsumeMessage) => void,
    options: IQueueListenerOptions
  ): Promise<void> {
    await RabbitMQService.init();
    const { channel } = RabbitMQService;

    await channel.assertQueue(queue, { durable: true });

    await channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          channel.ack(msg);
          callback(msg);

          if (options.simultaneous) await channel.cancel(msg.fields.consumerTag);
        }
      },
      { exclusive: false }
    );
  }

  private async sendRequestToService(
    queue: RabbitMQQueue,
    message: string,
    { correlationId, replyTo }: amqp.Options.Publish,
    args?: Record<string, unknown>
  ): Promise<void> {
    return await this.sendToQueue(
      queue,
      JSON.stringify({ command: message, arguments: args ?? null }),
      {
        correlationId,
        replyTo,
      }
    );
  }

  private async sendAnswerToApi(
    answer: IServiceResponse,
    { correlationId }: amqp.Options.Publish
  ): Promise<void> {
    return await this.sendToQueue(RabbitMQQueue.Api, JSON.stringify(answer), {
      correlationId,
    });
  }

  public async handleApiRequests(
    service: Service,
    callback: (data: IApiRequest) => Promise<IServiceResponse | undefined>
  ): Promise<void> {
    return await this.addQueueListener(
      RabbitMQQueue[service],
      async (data) => {
        const requestId = data.properties.correlationId;

        const result = await callback(JSON.parse(data.content.toString()));
        if (result) {
          await this.sendAnswerToApi(result, { correlationId: requestId });
        }
      },
      { simultaneous: false }
    );
  }

  public async sendRequestToServiceAndConsume(
    queue: RabbitMQQueue,
    command: Operation,
    callback: (data: IServiceResponse) => void,
    args?: Record<string, unknown>
  ): Promise<void> {
    const requestId = uuidv4();

    await this.sendRequestToService(
      queue,
      command,
      {
        correlationId: requestId,
        replyTo: RabbitMQQueue.Api,
      },
      args
    );

    await this.addQueueListener(
      RabbitMQQueue.Api,
      (serviceMsg) => {
        if (serviceMsg.properties.correlationId === requestId) {
          callback(JSON.parse(serviceMsg.content.toString()));
        }
      },
      { simultaneous: true }
    );
  }
}

export const rabbitmqService = new RabbitMQService();
