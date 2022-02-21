const Module = require("./module.model");

module.exports = (sequelize, Sequelize) => {
    const Attendance = sequelize.define(
        "Attendance",
        {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },

            arrivalTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            departureTime: {
                type: Sequelize.DATE,
            },
        },
        { tableName: "Attendance" }
    );

    return Attendance;
};
