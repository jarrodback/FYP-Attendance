module.exports = {
    dev: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "attendance-system",
        host: "localhost",
        dialect: "postres",
        port: 5432,
    },
};
