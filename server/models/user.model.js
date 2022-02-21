module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
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
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            type: {
                type: Sequelize.ENUM,
                values: ["Student", "Lecturer"],
            },

            createdAt: Sequelize.DATE,

            updatedAt: Sequelize.DATE,
        },
        { tableName: "Users" }
    );

    return User;
};
