'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Distributions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      op_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'StockOperation',
          key:'operation_id'
        }
      },
      consumer_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Consumer',
          key:'id'
        }
      },
      total: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('Distributions');
  }
};