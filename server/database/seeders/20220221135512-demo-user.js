"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        return queryInterface.bulkInsert("Users", [
            {
                id: "87761a47-89b7-4fa1-8eeb-88c2b2a637f9",
                username: "bob",
                email: "bob@example.com",
                password: "test",
                type: "Student",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "87761a47-89b7-4fa1-8eeb-88c2b2a637f8",
                username: "john",
                email: "john@example.com",
                password: "test",
                type: "Student",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: "87761a47-89b7-4fa1-8eeb-88c2b2a637f7",
                username: "sarah",
                email: "sarah@example.com",
                password: "test",
                type: "Lecturer",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return queryInterface.bulkDelete("Users", null, {});
    },
};
