import { Response, Request } from "express";
import { usersMailer } from "../mailers";
import { rabbitmqService, UsersOperation, SessionsOperation, RabbitMQQueue } from "../services";
import { tokenGenerator } from "../utils";

class UsersController {
  async register(req: Request, res: Response): Promise<void> {
    await rabbitmqService.sendRequestToServiceAndConsume(
      RabbitMQQueue.Users,
      UsersOperation.Register,
      async (usersServiceData) => {
        const { status, body, message } = usersServiceData;

        if (status === 400) {
          res.status(400).send({ error: message ?? "Invalid request data" });
          return;
        }

        if (body) {
          const userId = body.id;
          const jwtPacket = tokenGenerator.signTokens({ userId: userId.toString() });
          const { access, refresh } = jwtPacket;

          await rabbitmqService.sendRequestToServiceAndConsume(
            RabbitMQQueue.Sessions,
            SessionsOperation.Sign,
            (sessionsServiceData) => {
              const { status: sessionStatus } = sessionsServiceData;
              if (sessionStatus === 200) {
                res.status(200).send({ ...jwtPacket, message: "Successfully registered" });
                return;
              }

              res.status(500).send({ error: "Unexpected error" });
            },
            {
              ip: req.ip,
              accessToken: access,
              refreshToken: refresh,
            }
          );
        } else {
          res.status(500).send({ error: "Unexpected error" });
        }
      },
      { ...req.body }
    );
  }

  async login(req: Request, res: Response): Promise<void> {
    await rabbitmqService.sendRequestToServiceAndConsume(
      RabbitMQQueue.Users,
      UsersOperation.Login,
      async (data) => {
        const { status, body, message } = data;
        if (status === 200 && body) {
          const jwtPacket = tokenGenerator.signTokens({ userId: body.id.toString() });
          const { access, refresh } = jwtPacket;
          await rabbitmqService.sendRequestToServiceAndConsume(
            RabbitMQQueue.Sessions,
            SessionsOperation.Sign,
            (sessionsServiceData) => {
              const { status: sessionStatus } = sessionsServiceData;
              if (sessionStatus === 200) {
                res.status(200).send({ ...jwtPacket, message });
                return;
              }

              res.status(500).send({ error: "Unexpected error" });
            },
            {
              ip: req.ip,
              accessToken: access,
              refreshToken: refresh,
            }
          );
        } else {
          res.status(status).send({ error: message });
        }
      },
      { ...req.body }
    );
  }

  async signOut(req: Request, res: Response): Promise<void> {
    const { userId } = req;

    if (userId) {
      await rabbitmqService.sendRequestToServiceAndConsume(
        RabbitMQQueue.Users,
        UsersOperation.SignOut,
        async (data) => {
          const { status, message } = data;
          if (status === 200) {
            await rabbitmqService.sendRequestToServiceAndConsume(
              RabbitMQQueue.Sessions,
              SessionsOperation.Forget,
              (sessionsServiceData) => {
                const { status: tokenStatus, message: tokenMessage } = sessionsServiceData;
                if (tokenStatus === 200) {
                  res.status(200).send({ message: tokenMessage });
                  return;
                }

                res.status(400).send({ error: tokenMessage });
              },
              { ip: req.ip }
            );
          } else {
            res.status(400).send({ error: message });
          }
        },
        { userId }
      );
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { token } = req.body;
    const { valid, payload } = tokenGenerator.isValid(token);
    if (valid && payload && token && typeof payload === "object" && "userId" in payload) {
      await rabbitmqService.sendRequestToServiceAndConsume(
        RabbitMQQueue.Sessions,
        SessionsOperation.Refresh,
        (sessionsServiceData) => {
          const { status, body, message } = sessionsServiceData;

          if (status === 200 && body) {
            res.status(200).send({ ...body, message });
          } else {
            res.status(401).send({ error: message ?? "Unexpected error" });
          }
        },
        {
          ip: req.ip,
          userId: payload.userId,
          refreshToken: token,
        }
      );
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      await rabbitmqService.sendRequestToServiceAndConsume(
        RabbitMQQueue.Users,
        UsersOperation.ForgotPas,
        async (data) => {
          const { status, body, message } = data;

          if (status === 200 && body) {
            await usersMailer.forgotPassword(body);
            res.status(200).send({ message: "Password restoration email send" });
            return;
          }

          res.status(status).send(message);
        },
        { email }
      );
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

        await rabbitmqService.sendRequestToServiceAndConsume(
          RabbitMQQueue.Users,
          UsersOperation.ResetPas,
          async (data) => {
            const { status, message } = data;

            if (status === 200) {
              const jwtPacket = tokenGenerator.signTokens({ userId });
              const { access, refresh } = jwtPacket;

              await rabbitmqService.sendRequestToServiceAndConsume(
                RabbitMQQueue.Sessions,
                SessionsOperation.Sign,
                (sessionsServiceData) => {
                  const { status: sessionStatus } = sessionsServiceData;

                  if (sessionStatus === 200) {
                    res
                      .status(200)
                      .send({ ...jwtPacket, message: "Password has been successfully reset" });
                    return;
                  }

                  res.status(sessionStatus).send({ error: "Could not start new session" });
                },
                {
                  ip: req.ip,
                  accessToken: access,
                  refreshToken: refresh,
                }
              );
            } else {
              res.status(status).send({ message });
            }
          },
          { id: userId, newPassword }
        );
      }
    } catch (err: any) {
      res.status(500).send({ error: "Unexpected error occured" });
    }
  }
}

export const usersController = new UsersController();
