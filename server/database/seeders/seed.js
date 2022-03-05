const Sequelize = require("sequelize");
const env = process.env.NODE_ENV ?? "test";
const config = require("../../database/config")[env];
const db = {};

let sequelize;
// Create connection string from config.
if (!config.username) {
    sequelize = new Sequelize(
        `postgres://kglsfxcrnhwitj:98d2f4f1a2a867acd12f7ba45bdbbfe2b4cb383c879723a73cd936581fd3995f@ec2-52-211-158-144.eu-west-1.compute.amazonaws.com:5432/d4sqigfnv69mna`
    );
} else {
    sequelize = new Sequelize(
        `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
    );
}
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
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);

    let endTime = new Date();
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);

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

    let fakeTime = new Date();
    fakeTime.setMonth(1);
    fakeTime.setDate(28);
    let fakeTime2 = new Date();
    fakeTime2.setMonth(2);
    fakeTime2.setDate(7);
    let fakeTime3 = new Date();
    fakeTime3.setMonth(2);
    fakeTime3.setDate(14);
    let fakeTime4 = new Date();
    fakeTime4.setMonth(2);
    fakeTime4.setDate(21);
    let fakeTime5 = new Date();
    fakeTime5.setMonth(2);
    fakeTime5.setDate(28);

    let olderThan30 = new Date();
    olderThan30.setUTCFullYear(2021, 1, 1);
    let olderThan302 = new Date();
    olderThan302.setUTCFullYear(2021, 1, 2);

    const realUser = await db.user.create({
        id: "0caf51d2-6648-47ca-bae2-257535cd7f32",
        username: "JARROD BACK",
        email: "b8043407@my.shu.ac.uk",
        type: "Student",
        activity: [
            {
                module: module2.name,
                attendedAt: olderThan30,
                type: "Missed",
            },
            {
                module: module1.name,
                attendedAt: olderThan302,
                type: "Attended",
            },
            {
                module: module2.name,
                attendedAt: fakeTime,
                type: "Missed",
            },
            {
                module: module1.name,
                attendedAt: new Date(),
                type: "Attended",
            },
            {
                module: module2.name,
                attendedAt: new Date(),
                type: "Attended",
            },
            {
                module: module2.name,
                attendedAt: fakeTime2,
                type: "Missed",
            },
            {
                module: module2.name,
                attendedAt: fakeTime3,
                type: "Attended",
            },
            {
                module: module1.name,
                attendedAt: fakeTime3,
                type: "Attended",
            },
            {
                module: module1.name,
                attendedAt: fakeTime4,
                type: "Missed",
            },
            {
                module: module2.name,
                attendedAt: fakeTime4,
                type: "Attended",
            },
            {
                module: module1.name,
                attendedAt: fakeTime5,
                type: "Missed",
            },
            {
                module: module2.name,
                attendedAt: fakeTime5,
                type: "Attended",
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
        target: 50,
    });

    await db.moduleUser.create({
        ModuleId: module2.id,
        UserId: realUser.id,
        attendedSessions: 7,
        target: 100,
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
