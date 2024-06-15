import User from "../models/User.js";

class UserController {
  async getAll(req, res) {
    try {
      const Users = await User.findAll();
      res.json(Users);
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error });
    }
  }

  async getUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server Error " + error });
    }
  }

  async getUserName(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user.name);
    } catch (error) {
      res.status(500).json({ message: "Server Error " + error });
    }
  }

  async getUserEmail(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user.email);
    } catch (error) {
      res.status(500).json({ message: "Server Error " + error });
    }
  }

  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      const createResult = await User.create({
        name,
        email,
        password_hash: password,
      });
      res.json(createResult);
    } catch (error) {
      res.status(500).json({ message: "Server Error " + error });
    }
  }

  async updateUser(req, res) {
    try {
      const { name, email, password } = req.body;

      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      user.name = name ?? user.name;
      user.email = email ?? user.email;
      user.password = password ?? user.password;

      const updatedUser = await user.save();

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server Error " + error });
    }
  }

  async updateUserPassword(req, res) {
    try {
      const { password } = req.body;

      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      user.password = password ?? user.password;

      const updatedUser = await user.save();

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server Error " + error });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      User.destroy({ where: { id: req.params.id } });

      res.json({ message: "User removed" });
    } catch (error) {
      res.status(500).json({ message: "Server Error: " + error });
    }
  }
}

export default new UserController();
