import { NextFunction, Request, Response } from "express";
import { RabbitMQQueue, rabbitmqService, SessionsOperation } from "../services";

export const sessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const requestIp = req.ip;

  const requestToken = req.token;

  if (!requestToken) {
    res.status(401).send("Unrecongized session");
  }

  await rabbitmqService.sendRequestToServiceAndConsume(
    RabbitMQQueue.Sessions,
    SessionsOperation.Validate,
    (validationResponse) => {
      const { isValid, message, session } = validationResponse.body;

      if (!isValid) {
        res.status(401).send(message);
      }

      if (isValid && session) {
        const isTokenSimilar = requestToken === session.accessToken;

        if (isTokenSimilar) {
          next();
          return;
        }

        res.status(401).send("Access token is invalid");
      }
    },
    { ip: requestIp }
  );
};
