'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.Units,{
         foreignKey: 'unit_id',
         constraints: false
      })
      // define association here
    }
  }
  Product.init({
    product_id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
    },
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    unit_id: DataTypes.INTEGER,
    count_type: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    category_id: DataTypes.INTEGER,
    returnable_product: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};