module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        "User",
        {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },

            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            type: {
                type: Sequelize.ENUM,
                values: ["Student", "Lecturer"],
            },

            activity: {
                type: Sequelize.JSON,
            },
        },
        { tableName: "Users" }
    );
};
