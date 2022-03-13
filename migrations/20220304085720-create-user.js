'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Location',
          key:'location_id'
        }
      },
      role: {
        type: Sequelize.INTEGER,
        reference:{
          model:'Role',
          key:'id'
        }
      },
      password: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      queryInterface.bulkInsert("Users", [{
        name: "Merun",
        phone:"0171",
        email:"merunhowlader@gmail.com",
        password:"$2a$10$jKpO0ShCE8oO6j4xl589fuJaXpDcIzkjlBAWHvRTdLefLW0BWb6c.",
        role:1,
        department:0, 
        status:true,
        createdAt: new Date(),
        updatedAt: new Date()
      
          
          },
         
      ]);
       });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};