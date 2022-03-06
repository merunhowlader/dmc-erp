'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LoanInventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      location_id_from: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Location',
          key:'location_id'
        }
      },
      location_id_to: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Location',
          key:'location_id'
        }
      },
      product_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Product',
          key:'product_id'
        }
      },
      quantity: {
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
    await queryInterface.dropTable('LoanInventories');
  }
};