'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Units', {
      unit_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    }).then(() => {
      queryInterface.bulkInsert("Units", [{
              name: "kg",
          
          },
          {
              name: "liter",
              
          },
          {
              name: "piece",
             
          },
      ]);
       });
     
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Units');
  }
};