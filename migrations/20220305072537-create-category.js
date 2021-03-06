'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
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
      queryInterface.bulkInsert("Categories", [{
              name: "ICT",
          
          },
          {
              name: "Oxyzen",
              
          },
          {
              name: "Chemical",
              
          }
          ,
          {
              name: "Medicine",
              
          }
          ,
          {
              name: "Linen",
              
          }
          ,
          {
              name: "General",
              
          }
      ]);
       });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categories');
  }
};