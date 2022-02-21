module.exports = (sequelize, Sequelize) => {
    const Module = sequelize.define(
        "Module_User",
        {
            ModuleId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
            },

            UserId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
            },
        },
        { tableName: "Module_User" }
    );

    return Module;
};
