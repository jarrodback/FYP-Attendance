const Sequelize = require("sequelize");
const env = process.env.NODE_ENV ?? "test";
const config = require("../database/config")[env];

// Create connection string from config.
const sequelize = new Sequelize(
    `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
);
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
