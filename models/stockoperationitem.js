'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockOperationItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockOperationItem.belongsTo(models.Product,{
        foreignKey: 'product_id', 
         constraints: false
      })
      StockOperationItem.belongsTo(models.StockOperation,{
        foreignKey:'stockOperationId',
        constraints: false
      })
      StockOperationItem.hasMany(models.OperationTrackRecord,{
        foreignKey:'item_operation_id',
        constraints: false
      })
    }
  }
  StockOperationItem.init({
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    stockOperationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StockOperationItem',
  });
  return StockOperationItem;
};