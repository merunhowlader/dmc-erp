'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role,{
        foreignKey: 'role',
        constraints: false
      })
      User.hasOne(models.StockOperation,{
        foreignKey: 'createdBy',
        constraints: false
      })
      User.belongsTo(models.Location,{
        foreignKey: 'department',
        as:'Department',
        constraints: false
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    department: DataTypes.INTEGER,
    role: DataTypes.INTEGER,
    password: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};