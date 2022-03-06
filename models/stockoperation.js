'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockOperation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockOperation.belongsTo(models.Location,{
        foreignKey:'from',
        as: 'From',
        constraints: false
      })
      StockOperation.belongsTo(models.Location,{
        foreignKey:'to',
        as: 'To',
        constraints: false
      })
      StockOperation.hasMany(models.StockOperationItem,{
        foreignKey:'stockOperationId',
        constraints: false
      })
    }
  }
  StockOperation.init({
    operation_id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
    },
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    reference: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    operationType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StockOperation',
  });
  return StockOperation;
};