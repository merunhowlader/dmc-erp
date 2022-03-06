'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Distribution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Distribution.belongsTo(models.StockOperation,{
        foreignKey:'op_id',
        constraints: false
      })
      Distribution.belongsTo(models.Consumer,{
        foreignKey:'op_id',
        constraints: false
      })
    }
  }
  Distribution.init({
    op_id: DataTypes.INTEGER,
    consumer_id: DataTypes.INTEGER,
    total: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Distribution',
  });
  return Distribution;
};