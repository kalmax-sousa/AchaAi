import Sequelize, { Model } from "sequelize";

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        enrollment: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        image_url: {
          type: Sequelize.STRING,
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

export default Student;
