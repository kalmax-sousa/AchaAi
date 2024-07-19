import nodemailer from "nodemailer";
import { resolve, dirname } from "path";
import ejs from "ejs";
import { promisify } from "util";
import mailConfig from "../../config/mail.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MailProvider {
  constructor() {
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  async sendMail(to, subject, templateData, type = "confirm") {
    const templatePath = resolve(
      __dirname,
      "..",
      "views",
      "templates",
      "mail",
      type + ".ejs",
    );
    try {
      await this.transporter.sendMail({
        from: {
          name: "AcheAI",
          address: "devtester555@outlook.com",
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject,
        html: await promisify(ejs.renderFile)(templatePath, templateData),
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new MailProvider();
