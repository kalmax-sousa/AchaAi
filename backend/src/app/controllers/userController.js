import * as yup from "yup";
import crypto from "crypto";

import User from "../models/User.js";
import UserConfirmation from "../models/UserConfirmation.js";
import UserDTO from "../dto/UserDTO.js";

import MailProvider from "../../app/providers/MailProvider.js";

class UserController {
  async getAll(req, res) {
    try {
      const Users = await User.findAll();

      const UsersDTO = Users.map((user) => {
        return new UserDTO(user);
      });

      res.json(UsersDTO);
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor: " + error });
    }
  }
  async getUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor: " + error });
    }
  }
  async createUser(req, res) {
    try {
      const schema = yup.object().shape({
        name: yup.string().required("Nome é obrigatório!"),
        enrollment: yup.string().required("Matricula é obrigatória!"),
        email: yup
          .string()
          .email("Email deve ser valido. Ex: meu_email@exemplo.com")
          .required("Email é obrigatório!"),
        password: yup
          .string()
          .min(8, "Senha deve ter pelo menos 8 caracteres")
          .max(32, "Senha deve ter no maximo 32 caracteres")
          .required("Senha é obrigatória!"),
      });

      await schema.validate(req.body, { abortEarly: false });

      if (await User.findOne({ where: { email: req.body.email } })) {
        return res.status(400).json({ message: "Email já existente!" });
      }
      const createResult = await User.create(req.body);
      const createdUser = new UserDTO(createResult);

      const confirmation = await UserConfirmation.create({
        user_id: createdUser.id,
        token: crypto.randomBytes(90).toString("base64"),
      });

      await MailProvider.sendMail(
        {
          name: createdUser.name,
          email: createdUser.email,
        },
        "Ativação de conta",
        {
          name: createdUser.name,
          email: createdUser.email,
          token: confirmation.token,
        },
      );

      res.json(createdUser);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res
          .status(400)
          .json({ message: "Dados inválidos!", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro no servidor: " + error });
      }
    }
  }

  async updateUser(req, res) {
    try {
      const { name, email, password } = req.body;

      const user = await User.findByPk(req.params.id);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });

      user.name = name ?? user.name;
      user.email = email ?? user.email;
      user.password = password ?? user.password;

      const updatedUser = await user.save();

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor: " + error });
    }
  }

  async recoverUserPassword(req, res) {
    try {
      const schema = yup.object().shape({
        password: yup
          .string()
          .min(8, "Senha deve ter pelo menos 8 caracteres")
          .max(32, "Senha deve ter no maximo 32 caracteres")
          .required("Senha é obrigatória!"),
        password_confirmation: yup
          .string()
          .oneOf([yup.ref("password")], "Senhas devem ser iguais"),
        token: yup.string().required("Token é obrigatório!"),
      });
      const { password, token } = req.body;

      await schema.validate(req.body, { abortEarly: false });

      const userConfirmation = await UserConfirmation.findOne({
        where: { token, isPasswordRecovery: true },
      });

      if (!userConfirmation)
        return res.status(404).json({ message: "Token invalido" });

      const user = await User.findByPk(userConfirmation.user_id);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });

      user.password = password ?? user.password;

      await user.save();

      await userConfirmation.destroy();

      res.status(204);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res
          .status(400)
          .json({ message: "Dados inválidos!", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro no servidor: " + error });
      }
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });

      User.destroy({ where: { id: req.params.id } });

      res.json({ message: "Usuario deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor: " + error });
    }
  }
}

export default new UserController();
