'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductAttribute.init({
    created_by: DataTypes.INTEGER,
    notice: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductAttribute',
  });
  return ProductAttribute;
};