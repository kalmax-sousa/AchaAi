import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";

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
      await this.connection.sync(/* { force: true } */);
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

export default new Database();
