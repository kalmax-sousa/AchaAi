import Item from "../models/Item.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import { Op } from "sequelize";
import yup from "yup";

import StorageProvider from "../providers/StorageProvider.js";

class ItemController {
  async show(req, res) {
    try {
      const { category, query } = req.body;

      if (query.status === "DELIVERED" || query.expired) {
        return res.status(401).json({ error: "Permissão negada" });
      }
      const items = await Item.findAll({
        where: {
          name: { [Op.iLike]: `%${query.name ?? ""}%` },
          location: { [Op.iLike]: `%${query.location ?? ""}%` },
          description: { [Op.iLike]: `%${query.description ?? ""}%` },
          status: query.status ?? {
            [Op.or]: ["LOST_AND_FOUND", "WITH_FINDER"],
          },
          finded_at: query.finded_at
            ? new Date(query.finded_at)
            : {
                [Op.gte]: new Date("1970-01-01"),
              },
          expired: query.expired ?? {
            [Op.or]: [false, null, true],
          },
          category_id: category ? { [Op.eq]: category } : "",
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
      });
      return res.json(items);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Falha no servidor: " + error.message });
    }
  }

  async index(req, res) {
    try {
      const item = await Item.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"],
          },
        ],
      });

      if (!item) {
        return res.status(404).json({ error: "Item não encontrado" });
      }
      if (item.status === "DELIVERED" || item.expired) {
        return res.status(401).json({ error: "Permissão negada" });
      }

      return res.json(item);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Falha no servidor: " + error.message });
    }
  }

  async store(req, res) {
    try {
      const {
        name,
        description,
        location,
        status,
        expired,
        category,
        finded_at,
      } = JSON.parse(req.body.item);

      if ((status === "DELIVERED" || expired) && !req.admin) {
        return res.status(401).json({ error: "Permissão negada" });
      }

      const uploadResult = await StorageProvider.uploadOnCloud(req.file).catch(
        (error) => {
          return res
            .status(406)
            .json({ message: "Falha no upload: " + error.message });
        },
      );

      let image_url = "";
      if (uploadResult) {
        image_url = uploadResult.secure_url;
      }

      const item = await Item.create({
        name,
        description,
        location,
        image_url,
        status,
        finded_at,
        expired,
        category_id: category,
        user_id: req.userId, // Assumes the user ID is available in req.userId (e.g., from JWT)
      });

      return res.status(201).json(item);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro no servidor: " + error.message });
    }
  }

  async update(req, res) {
    try {
      const {
        name,
        description,
        location,
        status,
        expired,
        category,
        finded_at,
      } = JSON.parse(req.body.item);
      const item = await Item.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ error: "Item não encontrado" });
      }
      if (req.userId !== item.user_id || !req.admin) {
        return res.status(401).json({ error: "Permissão negada" });
      }

      const uploadResult = await StorageProvider.uploadOnCloud(req.file).catch(
        (error) => {
          return res
            .status(406)
            .json({ message: "Falha no upload: " + error.message });
        },
      );

      await item.update({
        name,
        description,
        location,
        image_url: uploadResult.secure_url,
        status,
        finded_at,
        expired,
        category_id: category,
      });

      return res.status(200).json(item);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro no servidor: " + error.message });
    }
  }

  async delete(req, res) {
    try {
      const item = await Item.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ error: "Item não encontrado" });
      }

      if (req.userId !== item.user_id || !req.admin) {
        return res.status(401).json({ error: "Permissão negada" });
      }

      await item.destroy();

      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro no servidor: " + error.message });
    }
  }
}

export default new ItemController();
