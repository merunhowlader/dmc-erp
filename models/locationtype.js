'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocationType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LocationType.hasMany(models.Location,{
        foreignKey: 'type',
        constraints: false
      })
    }
  }
  LocationType.init({
    locationType_id: {
      type:DataTypes.INTEGER,
      primaryKey: true

    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LocationType',
  });
  return LocationType;
};