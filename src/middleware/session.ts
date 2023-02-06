import { NextFunction, Request, Response } from "express";
import { sessionsService } from "../services";

export const sessionModdleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const requestIp = req.ip;

  const requestToken = req.token;

  if (!requestToken) {
    res.status(401).send("Unrecongized session");
  }

  const validationResponse = await sessionsService.validateUserSession(requestIp);

  const { isValid, message } = validationResponse;

  if (!isValid) {
    res.status(401).send(message);
  }

  if (isValid) {
    const { body } = validationResponse;

    const isTokenSimilar = requestToken === body.accessToken;

    if (isTokenSimilar) {
      next();
      return;
    }

    res.status(401).send("Access token is invalid");
  }
};
