const Sequelize = require("sequelize");
const env = process.env.NODE_ENV ?? "test";
const config = require("../database/config")[env];

let sequelize;
// Create connection string from config.
try {
    sequelize = new Sequelize(
        `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
    );
} catch (error) {
    sequelize = new Sequelize(
        `postgres://qvepyucnyfvynm:1a6c281085380aa3f454bd552dae244d6b3cd4267d1c1b31d4c549352c2f665c@ec2-63-34-130-73.eu-west-1.compute.amazonaws.com:5432/d8hov7er500o9h`
    );
}
console.log(`Connected to database (${env}).`);
// Create database object and save models, ORM to it.
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.module = require("./module.model")(sequelize, Sequelize);
db.user = require("./user.model")(sequelize, Sequelize);
db.moduleUser = require("./moduleUser.model")(sequelize, Sequelize);
db.attendance = require("./attendance.model")(sequelize, Sequelize);

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
    foreignKey: "ModuleId",
    onDelete: "CASCADE",
});

db.module.hasMany(db.attendance);

db.attendance.belongsTo(db.user, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
});

db.user.hasMany(db.attendance);

module.exports = db;
