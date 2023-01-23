import { Response, Request } from "express";
import { refreshTokensService, usersService } from "../services";
import { tokenGenerator } from "../utils";

class UsersController {
  async register(req: Request, res: Response): Promise<void> {
    const { status, body, message } = await usersService.registerUser(req.body);
    if (status === 400) {
      res.status(400).send({ error: message ?? "Invalid request data" });
      return;
    }

    if (body) {
      const userId = body.id;
      const jwtPacket = tokenGenerator.signTokens({ userId });

      const { status: refreshTokenStatus } = await refreshTokensService.sign({
        userId,
        token: jwtPacket.refresh,
      });
      if (refreshTokenStatus === 200) {
        res.status(200).send({ ...jwtPacket, message: "Successfully registered" });
        return;
      }

      res.status(500).send({ error: "Unexpected error" });
      return;
    }

    res.status(500).send({ error: "Unexpected error" });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { status, body, message } = await usersService.loginUser(req.body);
    if (status === 200 && body) {
      const jwtPacket = tokenGenerator.signTokens({ userId: body.id });
      const { status: refreshTokenStatus } = await refreshTokensService.sign({
        userId: body.id,
        token: jwtPacket.refresh,
      });

      if (refreshTokenStatus === 200) {
        res.status(200).send({ ...jwtPacket, message });
        return;
      }

      res.status(500).send({ error: "Unexpected error" });
      return;
    }

    if (status === 400) {
      res.status(400).send({ error: message });
      return;
    }

    res.status(500).send({ error: "Unexpected error" });
  }

  async signOut(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    if (userId) {
      const { status, message } = await usersService.signOut(userId);
      if (status === 200) {
        const { status: tokenStatus, message: tokenMessage } = await refreshTokensService.forget(
          userId
        );
        if (tokenStatus === 200) {
          res.status(200).send({ message: tokenMessage });
          return;
        }

        res.status(400).send({ error: tokenMessage });
        return;
      }

      res.status(400).send({ error: message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { token } = req.body;
    const { valid, payload } = tokenGenerator.isValid(token);
    if (valid && payload && token && typeof payload === "object" && "userId" in payload) {
      const { status, body, message } = await refreshTokensService.refresh({
        userId: payload.userId,
        token,
      });

      if (status === 200 && body) {
        res.status(200).send({ ...body, message });
        return;
      }

      res.status(401).send({ error: message ?? "Unexpected error" });
    }
  }
}

export const usersController = new UsersController();
