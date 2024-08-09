import * as yup from "yup";
import crypto from "crypto";

import User from "../models/User.js";
import UserConfirmation from "../models/UserConfirmation.js";
import UserDTO from "../dto/UserDTO.js";

import MailProvider from "../../app/providers/MailProvider.js";
import StorageProvider from "../providers/StorageProvider.js";

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

      const userDTO = new UserDTO(user);

      res.json(userDTO);
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor: " + error });
    }
  }
  async createUser(req, res) {
    const transaction = await User.sequelize.transaction();

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
        password_confirmation: yup
          .string()
          .oneOf([yup.ref("password"), null], "Senhas diferentes")
          .required("Confirmação de senha é obrigatória!"),
      });

      await schema.validate(req.body, { abortEarly: false });

      if (await User.findOne({ where: { email: req.body.email } })) {
        return res.status(400).json({ message: "Email já existente!" });
      }

      if (await User.findOne({ where: { enrollment: req.body.enrollment } })) {
        return res.status(400).json({ message: "Matricula ja existente!" });
      }

      const createResult = await User.create(req.body, { transaction });
      const createdUser = new UserDTO(createResult);

      const confirmation = await UserConfirmation.create(
        {
          user_id: createdUser.id,
          token: crypto.randomBytes(90).toString("base64"),
        },
        { transaction },
      );

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

      await transaction.commit();
      res.json(createdUser);
    } catch (error) {
      await transaction.rollback();

      if (error instanceof yup.ValidationError) {
        res
          .status(400)
          .json({ message: "Dados inválidos!", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro no servidor: " + error });
      }
    }
  }

  async updateUserAvatar(req, res) {
    const transaction = await User.sequelize.transaction();

    try {
      const user = await User.findByPk(req.userId);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });

      const uploadResult = await StorageProvider.uploadOnCloud(
        req.file,
        user.image_url,
      ).catch((error) => {
        return res.status(406).json({ message: "Falha no upload: " + error });
      });

      if (uploadResult) {
        user.image_url = uploadResult.secure_url;
      }

      const updatedUser = await user.save({ transaction });
      const updatedUserDTO = new UserDTO(updatedUser);

      await transaction.commit();
      res.json(updatedUserDTO);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: "Erro no servidor: " + error });
    }
  }

  async updateUserPassword(req, res) {
    const transaction = await User.sequelize.transaction();

    try {
      const schema = yup.object().shape({
        old_password: yup
          .string()
          .min(8, "Senha deve ter pelo menos 8 caracteres")
          .max(32, "Senha deve ter no maximo 32 caracteres")
          .required("Senha anterior é obrigatória!"),
        password: yup
          .string()
          .min(8, "Senha deve ter pelo menos 8 caracteres")
          .max(32, "Senha deve ter no maximo 32 caracteres")
          .required("Nova Senha é obrigatória!"),
        password_confirmation: yup
          .string()
          .oneOf(
            [yup.ref("password")],
            "Confirmação e nova senha devem ser iguais",
          )
          .required("Confirmação da senha é obrigatória!"),
      });
      const { password, password_confirmation } = req.body;

      await schema.validate(req.body, { abortEarly: false });

      const user = await User.findByPk(req.userId);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });

      if (!(await user.checkPassword(password, user.password_hash))) {
        return res.status(401).json({ message: "Senha Invalida" });
      }

      if (password === password_confirmation) {
        return res
          .status(406)
          .json({ message: "As senhas devem ser diferentes" });
      }

      user.password = password;
      const updatedUser = await user.save({ transaction });
      const updatedUserDTO = new UserDTO(updatedUser);

      await transaction.commit();
      res.json(updatedUserDTO);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: "Erro no servidor: " + error });
    }
  }

  async updateUserProfile(req, res) {
    const transaction = await User.sequelize.transaction();

    try {
      const schema = yup.object().shape({
        name: yup.string(),
        email: yup.string().email(),
        phonenumber: yup.string(),
      });
      const { name, email, phonenumber } = req.body;

      await schema.validate(req.body, { abortEarly: false });

      const user = await User.findByPk(req.userId);

      if (!user)
        return res.status(404).json({ message: "Usuario nao encontrado" });

      user.name = name;
      user.email = email;
      user.phonenumber = phonenumber;

      const updatedUser = await user.save({ transaction });
      const updatedUserDTO = new UserDTO(updatedUser);

      await transaction.commit();
      res.json(updatedUserDTO);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: "Erro no servidor: " + error });
    }
  }

  async recoverUserPassword(req, res) {
    const transaction = await User.sequelize.transaction();

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

      await user.save({ transaction });

      await userConfirmation.destroy({ transaction });

      await transaction.commit();
      res.status(204);
    } catch (error) {
      await transaction.rollback();

      if (error instanceof yup.ValidationError) {
        res
          .status(400)
          .json({ message: "Dados inválidos!", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erro no servidor: " + error });
      }
    }
  }
}

export default new UserController();
