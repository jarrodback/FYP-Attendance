module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "Module_User",
        {
            ModuleId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "Modules",
                    key: "id",
                },
            },

            UserId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "Users",
                    key: "id",
                },
            },

            attendedSessions: {
                type: Sequelize.INTEGER,
                allowNull: false,
                default: 0,
            },
        },
        { tableName: "Module_User" }
    );
};
