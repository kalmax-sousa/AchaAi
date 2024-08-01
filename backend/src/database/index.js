import Sequelize from "sequelize";

import databaseConfig from "../config/database.js";
import superuserConfig from "../config/superuser.js";

import User from "../app/models/User.js";
import Item from "../app/models/Item.js";
import Register from "../app/models/Register.js";
import Category from "../app/models/Category.js";
import UserConfirmation from "../app/models/UserConfirmation.js";

const models = [User, Item, Register, Category, UserConfirmation];

class Database {
  constructor() {
    this.init();
    this.sync();
    this.createSuperuser();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      );
  }

  async sync() {
    try {
      if (process.argv[2] === "dbclear") {
        await this.connection.sync({ force: true });
        console.log("Database Cleared");
      } else {
        await this.connection.sync();
        console.log("Connection has been established successfully.");
      }
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  async createSuperuser() {
    const { User } = this.connection.models;
    const superAdmin = await User.findOne({
      where: {
        email: superuserConfig.email,
      },
    });
    if (!superAdmin) {
      await User.create({
        name: "Superuser",
        email: superuserConfig.email,
        admin: true,
        password: superuserConfig.password,
        verified: true,
      });
    }
  }
}

export default new Database();
