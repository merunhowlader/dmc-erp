'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Location.belongsTo(models.LocationType,{
        foreignKey: 'type',
        constraints: false
      })
      Location.hasMany(models.Location,{
        foreignKey: 'parentLocation',
        as:'substore',
        constraints: false
      })
      Location.hasMany(models.Inventory,{
        foreignKey: 'location_id',
        constraints: false
      })
      Location.hasMany(models.LoanInventory,{
        foreignKey: 'location_id_from',
        as:'from',
        constraints: false 
      })
      Location.hasMany(models.LoanInventory,{
        foreignKey: 'location_id_to',
        as:'to', 
        constraints: false
      })
      Location.hasMany(models.Product,{
        foreignKey: 'root',
        constraints: false
      })
      Location.hasMany(models.User,{
        foreignKey: 'department',
      
        constraints: false
      })
      Location.hasMany(models.ProductSerialised,{
        foreignKey: 'location_id',
        constraints: false
      })
      Location.hasMany(models.ProductBatch,{
        foreignKey: 'location_id',
        constraints: false
      })
      
      
    }
  }
  Location.init({
    location_id:{
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:true,
    },
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    parentLocation: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};