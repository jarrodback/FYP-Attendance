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

            moduleId: {
                type: Sequelize.UUID,
                allowNull: false,
            },

            arrivalTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            departureTime: {
                type: Sequelize.DATE,
            },
        },
        { tableName: "attendance" }
    );

    Attendance.sync({ force: true }).catch(() => {
        console.log("Attendance model failed to sync with database.");
    });

    return Attendance;
};
