import Item from "../models/Item.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

import StorageProvider from "../providers/StorageProvider.js";

class ItemController {
  async show(req, res) {
    try {
      const { category, ...query } = req.body;
      const items = await Item.findAll({
        where: query,
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
            where: category ? { id: category } : undefined,
          },
        ],
      });
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch items" + error });
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
            through: { attributes: [] },
          },
        ],
      });

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      return res.json(item);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch item" + error });
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

      const uploadResult = await StorageProvider.uploadOnCloud(req.file).catch(
        (error) => {
          return res.status(406).json({ message: "Falha no upload: " + error });
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
      return res.status(500).json({ error: "Failed to create item" + error });
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
        return res.status(404).json({ error: "Item not found" });
      }

      const uploadResult = await StorageProvider.uploadOnCloud(req.file);

      await item.update({
        name,
        description,
        location,
        image_url: uploadResult,
        status,
        finded_at,
        expired,
        category_id: category,
      });

      return res.status(200).json(item);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update item" + error });
    }
  }

  async delete(req, res) {
    try {
      const item = await Item.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      await item.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete item" + error });
    }
  }
}

export default new ItemController();
