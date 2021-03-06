'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductBatch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductBatch.belongsTo(models.Product,{
        foreignKey: 'product_id',
        constraints: false
      })
      ProductBatch.belongsTo(models.Location,{
        foreignKey: 'location_id',
        constraints: false
      })
      // define association here
    
    
    }
  }
  ProductBatch.init({
    batch_number: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER,
    experyDate: DataTypes.DATE,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductBatch',
  });
  return ProductBatch;
};