import { UserModel } from "../types";
import { tokenGenerator } from "../utils";
import { BaseMailer } from "./BaseMailer";

class UsersMailer extends BaseMailer {
  public async forgotPassword(user: UserModel): Promise<void> {
    const token = tokenGenerator.signMailerToken({ userId: user.id });
    const domain =
      process.env.NODE_ENV === "production"
        ? process.env.PROD_MAILER_HOST
        : `${process.env.DEV_MAILER_HOST}:${process.env.PORT}`;
    const restorePasswordLink = `http://${domain}/users/resetPas/${token}`;

    await this.send({
      to: user.email,
      subject: "Restoration of account password",
      view: "usersMailer/forgotPassword",
      htmlVariables: { user, link: restorePasswordLink },
    });
  }
}

export const usersMailer = new UsersMailer();
