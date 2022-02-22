module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
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

            ModuleId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "Modules",
                    key: "id",
                },
            },

            UserId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
        },
        { tableName: "Attendance" }
    );
};
