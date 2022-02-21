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
                unique: true,
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            type: {
                type: Sequelize.ENUM,
                values: ["Student", "Lecturer"],
            },
        },
        { tableName: "Users" }
    );
};
