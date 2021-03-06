'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoanInventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LoanInventory.belongsTo(models.Product, { foreignKey: 'product_id',  constraints: false })
      LoanInventory.belongsTo(models.Location, { foreignKey: 'location_id_from',  constraints: false })
      LoanInventory.belongsTo(models.Location, { foreignKey: 'location_id_to',  constraints: false })
    }
  }
  LoanInventory.init({
    location_id_from: DataTypes.INTEGER,
    location_id_to: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'LoanInventory',
  });
  return LoanInventory;
};