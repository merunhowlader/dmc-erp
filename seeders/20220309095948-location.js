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
     return await queryInterface.bulkInsert('Locations', [{
      name: 'Main Supply',
      type:1,
      createdAt: new Date(),
      updatedAt: new Date()
     },{
      name: 'ict store',
      type:2,
      createdAt: new Date(),
      updatedAt: new Date()
      },{
        name: 'word',
        type:3,
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
