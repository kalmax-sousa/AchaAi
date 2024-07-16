import * as Yup from "yup";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";
import User from "../models/User.js";

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
      return res.status(401).json({ error: "Senha incorreta." });
    }
    const { id, name, enrollment, image_url, admin } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        enrollment,
        image_url,
        admin,
      },
      token: jwt.sign({ id, admin }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
