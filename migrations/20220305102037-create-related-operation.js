'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RelatedOperations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      act_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'StockOperation',
          key:'operation_id'
        }
      },
      demand_operation: {
        type: Sequelize.STRING
      },
      react_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'StockOperation',
          key:'operation_id'
        }
      },
      demandStatus: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('RelatedOperations');
  }
};