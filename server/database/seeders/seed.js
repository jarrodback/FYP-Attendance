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

    let startTime = new Date();
    startTime.setHours(12);
    startTime.setMinutes(0);
    startTime.setSeconds(0);

    let endTime = new Date();
    endTime.setHours(13);
    endTime.setMinutes(0);
    endTime.setSeconds(0);

    const module1 = await db.module.create({
        id: "72d6e07b-4f52-47bc-87d5-0110b9aa8c5c",
        name: "Module 1",
        numberOfSessions: 5,
        startTime: startTime,
        endTime: endTime,
    });

    const module2 = await db.module.create({
        name: "Module 2",
        numberOfSessions: 10,
        startTime: startTime,
        endTime: endTime,
    });

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

    const realUser = await db.user.create({
        id: "0caf51d2-6648-47ca-bae2-257535cd7f32",
        username: "JARROD BACK",
        email: "b8043407@my.shu.ac.uk",
        type: "Student",
        activity: [
            {
                module: module1.name,
                arrivedAt: new Date(),
            },
            {
                module: module2.name,
                arrivedAt: new Date(),
            },
        ],
    });

    await db.moduleUser.create({
        ModuleId: module1.id,
        UserId: user1.id,
        attendedSessions: 3,
    });

    await db.moduleUser.create({
        ModuleId: module1.id,
        UserId: user2.id,
        attendedSessions: 5,
    });

    await db.moduleUser.create({
        ModuleId: module2.id,
        UserId: user2.id,
        attendedSessions: 10,
    });

    await db.moduleUser.create({
        ModuleId: module1.id,
        UserId: realUser.id,
        attendedSessions: 3,
    });

    await db.moduleUser.create({
        ModuleId: module2.id,
        UserId: realUser.id,
        attendedSessions: 7,
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
