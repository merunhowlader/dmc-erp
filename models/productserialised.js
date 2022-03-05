'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSerialised extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductSerialised.init({
    serial_number: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductSerialised',
  });
  return ProductSerialised;
};