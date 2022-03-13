'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

     return await queryInterface.bulkInsert('Units', [{
      name: 'Kg',
      createdAt: new Date(),
      updatedAt: new Date()
     },{
          name: 'Liter',
          createdAt: new Date(),
          updatedAt: new Date()
      },{
        name: 'Piece',
        createdAt: new Date(),
        updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
