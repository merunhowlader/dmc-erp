'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StockOperationItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Product',
          key:'product_id'
        }
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      stockOperationId: {
        type: Sequelize.INTEGER,
        reference:{
          model:'StockOperation',
          key:'operation_id'
        }
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
    await queryInterface.dropTable('StockOperationItems');
  }
};