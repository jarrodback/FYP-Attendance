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
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        { tableName: "Modules" }
    );

    return Module;
};
