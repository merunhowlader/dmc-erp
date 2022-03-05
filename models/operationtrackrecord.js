'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OperationTrackRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OperationTrackRecord.init({
    track_id: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    item_operation_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OperationTrackRecord',
  });
  return OperationTrackRecord;
};