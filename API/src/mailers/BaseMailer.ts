import path from "path";
import ejs from "ejs";
import nodemailer, { Transporter } from "nodemailer";

interface ISendMailOptions {
  to: string;
  subject: string;
  view: string;
  htmlVariables?: Record<string, unknown>;
}

export class BaseMailer {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      host: process.env.CURRENT_HOST,
      auth: {
        user: process.env.GMAIL_MAILER_ADDRESS,
        pass: process.env.GMAIL_APP_KEY,
      },
    });
  }

  protected async send({ to, subject, view, htmlVariables }: ISendMailOptions): Promise<void> {
    const html = await ejs.renderFile(
      path.resolve(__dirname, `../views/mailers/${view}.ejs`),
      htmlVariables
    );

    const mailOptions = {
      from: process.env.GMAIL_MAILER_ADDRESS,
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
