import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";

import User from "../app/models/User.js";

const models = [User];

class Database {
  constructor() {
    this.init();
    this.sync();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
  }

  async sync() {
    try {
      await this.connection.sync();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

export default new Database();
