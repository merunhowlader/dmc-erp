'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product,{
        foreignKey: 'product_id',
        constraints: false
     })
      

      
      // define association here
    }
  }
  Category.init({
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
    modelName: 'Category',
  });
  return Category;
};