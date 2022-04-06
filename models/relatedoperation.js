'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RelatedOperation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      RelatedOperation.belongsTo(models.StockOperation,{
        foreignKey:'act_id',
        as: 'act',
        constraints: false
      })

      RelatedOperation.belongsTo(models.StockOperation,{
        foreignKey:'react_id',
        as: 'react',
        constraints: false})
      // define association here
    }
  }
  RelatedOperation.init({
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement: true,
      
    },
    act_id: DataTypes.INTEGER,
    demand_operation: DataTypes.STRING,
    react_id: DataTypes.INTEGER,
    demandStatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RelatedOperation',
  });
  return RelatedOperation;
};