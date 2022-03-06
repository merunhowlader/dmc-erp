'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductSerialiseds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serial_number: {
        type: Sequelize.STRING
      },
      product_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Product',
          key:'product_id'
        }
      },
      location_id: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Location',
          key:'location_id'
        }
      },
      experyDate: {
        type: Sequelize.DATE,
        
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
    await queryInterface.dropTable('ProductSerialiseds');
  }
};