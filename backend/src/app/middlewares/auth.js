import jwt from "jsonwebtoken";

import { promisify } from "util";
import authConfig from "../../config/auth.js";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não encontrado" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    req.admin = decoded.admin;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalido: " + err });
  }
};

export function isAdmin(req, res, next) {
  if (!req.admin) {
    return res
      .status(403)
      .json({ error: "Acesso negado. Apenas administradores." });
  }

  return next();
}
