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
      const userId = body._id.toString();
      const jwtPacket = await tokenGenerator.signTokens({ userId });

      const { status: refreshTokenStatus } = await refreshTokensService.sign({
        userId,
        token: jwtPacket.refresh,
      });
      if (refreshTokenStatus === 200) {
        res
          .status(200)
          .send({ ...jwtPacket, message: "Successfully registered" });
        return;
      }

      res.status(500).send({ error: "Unexpected error" });
      return;
    }

    res.status(500).send({ error: "Unexpected error" });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { status, body, message } = await usersService.loginUser(req.body);
    if (status === 200) {
      const jwtPacket = await tokenGenerator.signTokens({ userId: body._id });
      const { status: refreshTokenStatus } = await refreshTokensService.sign({
        userId: body._id,
        token: jwtPacket.refresh,
      });

      if (refreshTokenStatus === 200) {
        res
          .status(200)
          .send({ ...jwtPacket, message: "Successfully registered" });
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
}

export const usersController = new UsersController();
