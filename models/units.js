'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Units extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Units.hasMany(models.Product,{
        foreignKey: 'unit_id',
        constraints: false
     })
     
      // define association here
    }
  }
  Units.init({
    unit_id:{
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:true


    },
    name: DataTypes.STRING,
    
    createdAt: {
      allowNull: false,
      defaultValue: new Date(),
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      defaultValue: new Date(),
      type: DataTypes.DATE
    }
    
  }, {
    sequelize,
    modelName: 'Units',
  });
  return Units;
};