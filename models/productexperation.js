'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductExperation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductExperation.init({
    date: DataTypes.DATE,
    product_id: DataTypes.INTEGER,
    track_id: DataTypes.STRING,
    table_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductExperation',
  });
  return ProductExperation;
};