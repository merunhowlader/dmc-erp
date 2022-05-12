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
            name: "ICT Store",
            type:1
           
        },
        {
          name: "Medicine Store",
          type:1
         
        },
        {
          name: "Chemical Store",
          type:1
         
        },
        {
          name: "General Store",
          type:1
         
        },
        {
          name: "Linen Store",
          type:1
         
        },
        {
          name: "Front Store",
          type:1
         
        },
        {
          name: "Ward 100",
          type:2
         
      },
      {
        name: "Ward 101",
        type:2
       
      },
      {
        name: "Ward 102",
        type:2
       
      },
      {
        name: "Ward 103",
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