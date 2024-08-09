import * as Yup from "yup";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import authConfig from "../../config/auth.js";
import User from "../models/User.js";
import UserDTO from "../dto/UserDTO.js";
import UserConfirmation from "../models/UserConfirmation.js";

import MailProvider from "../../app/providers/MailProvider.js";

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const { email, password } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação dos dados." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Email não encontrado." });
    }
    if (!(await user.checkPassword(password, user.password_hash))) {
      return res.status(401).json({ error: "Email e/ou senha invalidos." });
    }

    if (!user.verified) {
      return res.status(401).json({ error: "Email não verificado." });
    }

    const userDTO = new UserDTO(user);

    return res.json({
      user: userDTO,
      token: jwt.sign(
        { id: userDTO.id, admin: user.admin },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresIn,
        },
      ),
    });
  }

  async recoverPassword(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação dos dados." });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Email não encontrado." });
    }

    if (!user.verified) {
      return res.status(401).json({ error: "Email não verificado." });
    }

    var confirmation = await UserConfirmation.findOne({
      where: { user_id: user.id, isPasswordRecovery: true },
    });

    if (!confirmation) {
      confirmation = await UserConfirmation.create({
        user_id: user.id,
        token: crypto.randomBytes(90).toString("base64"),
        isPasswordRecovery: true,
      });
    }

    await MailProvider.sendMail(
      {
        name: user.name,
        email: user.email,
      },
      "Recuperação de conta",
      {
        name: user.name,
        email: user.email,
        token: confirmation.token,
      },
      "recover",
    );

    return res.status(204);
  }

  async accountConfirmation(req, res) {
    const schema = Yup.object().shape({
      token: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação dos dados." });
    }

    const { token } = req.body;

    try {
      const userConfirmation = await UserConfirmation.findOne({
        where: { token },
      });
      if (!userConfirmation) {
        return res.status(401).json({ error: "Token invalido." });
      }
      if (userConfirmation.confirmed) {
        return res.status(200).json({ error: "Email ja verificado." });
      }
      const user = await User.findByPk(userConfirmation.user_id);
      user.verified = true;
      await user.save();

      await userConfirmation.update({ confirmed: true });

      return res.status(202).json({ message: "Email verificado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro no servidor: " + error });
    }
  }
}

export default new SessionController();
