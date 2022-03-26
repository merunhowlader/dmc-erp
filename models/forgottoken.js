'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ForgotToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ForgotToken.init({
    user_id: DataTypes.INTEGER,
    tem_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ForgotToken',
  });
  return ForgotToken;
};