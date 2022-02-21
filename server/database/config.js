module.exports = {
    development: {
        // username: process.env.DB_USERNAME,
        // password: process.env.DB_PASSWORD,
        username: "postgres",
        password: "hallam",
        database: "attendance-system",
        host: "localhost",
        dialect: "postres",
        port: 5432,
    },
    test: {
        username: "postgres",
        password: "hallam",
        database: "attendance-system-testing",
        host: "localhost",
        dialect: "postres",
        port: 5432,
    },
};
