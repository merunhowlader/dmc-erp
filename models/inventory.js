'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory.belongsTo(models.Product,{
        foreignKey: 'product_id',
        constraints: false
      })
    Inventory.belongsTo(models.Location ,{ foreignKey: 'location_id',  constraints: false })
    }
  }
  Inventory.init({
    location_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Inventory',
  });
  return Inventory;
};