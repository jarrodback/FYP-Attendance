module.exports = (sequelize, Sequelize) => {
    const Module = sequelize.define(
        "Module",
        {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },

            name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        },
        { tableName: "module" }
    );

    Module.sync({ force: true }).catch(() => {
        console.log("Module model failed to sync with database.");
    });

    return Module;
};
