const Sequelize = require("sequelize");
const env = process.env.NODE_ENV ?? "testing";
const config = require("../../database/config")[env];
const db = {};

// Create connection string from config.
const sequelize = new Sequelize(
    `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
);
db.sequelize = sequelize;
db.attendance = require("../../models/attendance.model")(sequelize, Sequelize);
db.module = require("../../models/module.model")(sequelize, Sequelize);
db.user = require("../../models/user.model")(sequelize, Sequelize);
db.moduleUser = require("../../models/moduleUser.model")(sequelize, Sequelize);

console.log(`Starting to seed database... (${env}).`);

const seedDB = async () => {
    await sequelize.sync({ force: true });

    db.module.belongsToMany(db.user, {
        through: db.moduleUser,
        foreignKey: "ModuleId",
    });
    db.user.belongsToMany(db.module, {
        through: db.moduleUser,
        foreignKey: "UserId",
    });

    const user1 = await db.user.create({
        username: "username",
        email: "email",
        password: "password",
        type: "Student",
    });
    const user2 = await db.user.create({
        username: "username2",
        email: "email2",
        password: "password2",
        type: "Lecturer",
    });
    user1.addModule();

    const module1 = await db.module.create({
        name: "Module 1",
    });
    const module2 = await db.module.create({
        name: "Module 2",
    });

    const moduleuser1 = await db.moduleUser.create({
        ModuleId: module1.id,
        UserId: user1.id,
    });

    const moduleuser2 = await db.moduleUser.create({
        ModuleId: module1.id,
        UserId: user2.id,
    });

    const moduleuser3 = await db.moduleUser.create({
        ModuleId: module2.id,
        UserId: user2.id,
    });
};

seedDB()
    .then(() => {
        console.log("Successfully seeded database.");
    })
    .catch((error) => {
        console.log("An error occurred while seeding the database.", error);
    })
    .finally(() => {
        db.sequelize.close();
    });
