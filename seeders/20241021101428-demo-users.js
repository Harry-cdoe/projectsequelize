const { faker } = require("@faker-js/faker");
const User = require("../models/user");

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create an array of 100 users
    let users = [];
    try {
      for (let i = 0; i < 100; i++) {
        const newUser = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        users.push(newUser);
      }

      // Use Promise.all with map to insert all users
      await Promise.all(users.map(user => User.create(user)));
      console.log('Users seeded successfully!');
      
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    // Delete all users from the Users table
    await queryInterface.bulkDelete('Users', null, {});
    console.log('All users deleted successfully!');
  }
};
