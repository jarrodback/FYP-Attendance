const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "dev";
const config = require("../database/config")[env];

// Create connection string from config.
const sequelize = new Sequelize(
    `postgres://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`
);

// Create database object and save models, ORM to it.
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.attendance = require("./attendance.model")(sequelize, Sequelize);
db.module = require("./module.model")(sequelize, Sequelize);

module.exports = db;
