'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LocationTypes', {
      locationType_id: {
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
      queryInterface.bulkInsert("LocationTypes", [{
              name: "Store",
          
          },
          {
              name: "SubStore",
              
          },
          {
              name: "Shop",
             
          },
          {
            name: "Ward",
           
        },
        {
          name: "Supply",
         
      },
      {
        name: "User",
       
      },
      {
        name: "Trash",
       
      },
      ]);
       });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LocationTypes');
  }
};