'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      product_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      sku: {
        type: Sequelize.STRING
      },
      unit_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Units',
          key:'unit_id'
        }
      },
      count_type: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      category_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Category',
          key:'id'
        }
      },
      root: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Location',
          key:'location_id'
        }
      },
      returnable_product: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};