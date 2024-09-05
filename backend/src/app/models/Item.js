import Sequelize, { Model } from "sequelize";

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        location: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        image_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM,
          values: ["DELIVERED", "LOST_AND_FOUND", "WITH_FINDER"],
          defaultValue: "WITH_FINDER",
          allowNull: false,
        },
        finded_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        expired: {
          type: Sequelize.BOOLEAN,
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  }
}

export default Item;
