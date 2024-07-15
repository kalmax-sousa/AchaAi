import Sequelize, { Model } from "sequelize";

class Register extends Model {
  static init(sequelize) {
    super.init(
      {
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        takeAway: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }

  static associate(models) {
    this.hasOne(models.User, { foreignKey: "user_id", as: "user" });
    this.hasOne(models.Item, { foreignKey: "item_id", as: "item" });
  }
}

export default Register;
