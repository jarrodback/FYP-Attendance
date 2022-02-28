module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
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

            startTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            endTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            numberOfSessions: {
                type: Sequelize.INTEGER,
                allowNull: false,
                default: 0,
            },
        },
        { tableName: "Modules" }
    );
};
