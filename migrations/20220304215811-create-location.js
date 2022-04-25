'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Locations', {
      location_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.INTEGER,
        reference:{
          model:'LocationType',
          key:'locationType_id'
        }
      },
      parentLocation: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Location',
          key:'id'
        }
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
      queryInterface.bulkInsert("Locations", [{
              name: "SupplyLocation",
              type:3,
          
          },
          {
              name: "UserLocation",
              type:4
              
          },
          {
              name: "TrashLocation",
              type:5
             
          },
          {
            name: "ict Store",
            type:1
           
        },
        {
          name: "medicine Store",
          type:1
         
        },
        {
          name: "Ward One",
          type:2
         
      },
      {
        name: "Ward Two",
        type:2
       
      },
      {
        name: "Adjustment",
        type:6
       
      },
      ]);
       });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Locations');
  }
};