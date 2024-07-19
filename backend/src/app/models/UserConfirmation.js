import Sequelize, { Model } from "sequelize";

class UserConfirmation extends Model {
  static init(sequelize) {
    super.init(
      {
        token: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        confirmed: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        isPasswordRecovery: {
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
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export default UserConfirmation;
