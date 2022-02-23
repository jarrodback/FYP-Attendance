const Sequelize = require("sequelize");
const env = process.env.NODE_ENV ?? "test";
const config = require("../../database/config")[env];
const db = {};

// Create connection string from config.
const sequelize = new Sequelize(
    `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
);
db.sequelize = sequelize;
db.module = require("../../models/module.model")(sequelize, Sequelize);
db.user = require("../../models/user.model")(sequelize, Sequelize);
db.moduleUser = require("../../models/moduleUser.model")(sequelize, Sequelize);
db.attendance = require("../../models/attendance.model")(sequelize, Sequelize);

console.log(`Starting to seed database... (${env}).`);

const seedDB = async () => {
    await sequelize.sync({ force: true });

    db.module.belongsToMany(db.user, {
        through: db.moduleUser,
        foreignKey: "ModuleId",
        onDelete: "CASCADE",
    });
    db.user.belongsToMany(db.module, {
        through: db.moduleUser,
        foreignKey: "UserId",
        onDelete: "CASCADE",
    });

    db.attendance.belongsTo(db.module, {
        as: "Modules",
        foreignKey: "ModuleId",
        onDelete: "CASCADE",
    });

    db.module.hasMany(db.attendance);

    db.attendance.belongsTo(db.user, {
        as: "Users",
        foreignKey: "UserId",
        onDelete: "CASCADE",
    });

    db.user.hasMany(db.attendance);

    const user1 = await db.user.create({
        id: "98fc1b08-6cd1-42c9-adcc-64e4df39673c",
        username: "username",
        email: "email",
        type: "Student",
    });
    const user2 = await db.user.create({
        username: "username2",
        email: "email2",
        type: "Lecturer",
    });

    const module1 = await db.module.create({
        name: "Module 1",
    });
    const module2 = await db.module.create({
        name: "Module 2",
    });

    await db.moduleUser.create({
        ModuleId: module1.id,
        UserId: user1.id,
    });

    await db.moduleUser.create({
        ModuleId: module1.id,
        UserId: user2.id,
    });

    await db.moduleUser.create({
        ModuleId: module2.id,
        UserId: user2.id,
    });

    await db.attendance.create({
        arrivalTime: new Date(),
        ModuleId: module1.id,
        UserId: user1.id,
    });

    await db.attendance.create({
        arrivalTime: new Date(),
        departureTime: new Date(),
        ModuleId: module2.id,
        UserId: user1.id,
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
