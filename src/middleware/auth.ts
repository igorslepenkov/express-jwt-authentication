import { NextFunction, Request, Response } from "express";
import { parseBearerToken, tokenGenerator } from "../utils";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.headers.authorization) {
    res.status(401).send("Unauthorized");
    return;
  }

  const token = parseBearerToken(req.headers.authorization);

  if (token === null) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { valid, payload } = tokenGenerator.isValid(token);
  if (!valid) {
    res.status(401).send({ error: payload });
    return;
  }

  if (valid && typeof payload === "object" && "userId" in payload) {
    const { userId } = payload;
    req.userId = userId;
    req.token = token;
    return next();
  }

  res.status(500).send({ error: "Unexpected error" });
};
