import Sequelize, { Model } from "sequelize";

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        image_url: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM,
          values: ["DELIVERED", "LOST_AND_FOUND", "WITH_FINDER"],
          defaultValue: "WITH_FINDER",
          allowNull: false,
        },
        stock: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
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
    this.belongsToMany(models.Category, {
      foreignKey: "category_id",
      as: "category",
      through: "item_category",
      timestamps: false,
    });
  }
}

export default Item;
