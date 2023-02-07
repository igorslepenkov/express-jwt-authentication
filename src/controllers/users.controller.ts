import { Response, Request } from "express";
import { usersMailer } from "../mailers";
import { usersService, sessionsService } from "../services";
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
      const jwtPacket = tokenGenerator.signTokens({ userId: userId.toString() });
      const { access, refresh } = jwtPacket;

      const { status: sessionStatus } = await sessionsService.sign({
        ip: req.ip,
        accessToken: access,
        refreshToken: refresh,
      });
      if (sessionStatus === 200) {
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
    console.log(status);
    if (status === 200 && body) {
      const jwtPacket = tokenGenerator.signTokens({ userId: body.id.toString() });
      const { access, refresh } = jwtPacket;

      const { status: sessionStatus } = await sessionsService.sign({
        ip: req.ip,
        accessToken: access,
        refreshToken: refresh,
      });

      if (sessionStatus === 200) {
        res.status(200).send({ ...jwtPacket, message });
        return;
      }

      res.status(500).send({ error: "Unexpected error" });
      return;
    }

    res.status(status).send({ error: message });
  }

  async signOut(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    if (userId) {
      const { status, message } = await usersService.signOut(userId);
      if (status === 200) {
        const { status: tokenStatus, message: tokenMessage } = await sessionsService.forget(req.ip);
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
      const { status, body, message } = await sessionsService.refresh({
        ip: req.ip,
        userId: payload.userId,
        refreshToken: token,
      });

      if (status === 200 && body) {
        res.status(200).send({ ...body, message });
        return;
      }

      res.status(401).send({ error: message ?? "Unexpected error" });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const { status, body, message } = await usersService.forgotPassword(email);

      if (status === 200 && body) {
        await usersMailer.forgotPassword(body);
        res.status(200).send({ message: "Password restoration email send" });
        return;
      }

      res.status(status).send(message);
    } catch (err) {
      res.status(500).send({ error: "Unexpected server error" });
    }
  }

  async getResetPassword(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).render("pages/resetPassword");
    } catch (err) {
      res.status(500).send({ error: "Something gone wrong" });
    }
  }

  async postResetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;

      const { valid, payload } = tokenGenerator.isValid(token);

      if (!valid) {
        res.status(401).send({ error: "Invalid token recieved" });
        return;
      }

      if (valid && typeof payload === "object" && "userId" in payload) {
        const { newPassword } = req.body;
        const { userId } = payload;

        const { status, message } = await usersService.resetPassword(userId, newPassword);

        if (status === 200) {
          const jwtPacket = tokenGenerator.signTokens({ userId });
          const { access, refresh } = jwtPacket;

          const { status: sessionStatus } = await sessionsService.sign({
            ip: req.ip,
            accessToken: access,
            refreshToken: refresh,
          });

          if (sessionStatus === 200) {
            res.status(200).send({ ...jwtPacket, message: "Password has been successfully reset" });
            return;
          }

          res.status(sessionStatus).send({ error: "Could not start new session" });
        }

        res.status(status).send(message);
      }
    } catch (err: any) {
      res.status(500).send({ error: "Unexpected error occured" });
    }
  }
}

export const usersController = new UsersController();
