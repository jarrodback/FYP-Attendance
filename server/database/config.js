const Client = require("pg").Client;

// Create connection string.
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "attendance-system",
    password: "hallam",
    port: 5432,
});

// Connect to database.
client
    .connect()
    .then(() => {
        console.log("Database succesfully connected.");

        // Setup tables.

        // Drop tables (For development)
        client.query(
            `DROP TABLE IF EXISTS attendance;
             DROP TABLE IF EXISTS module;`
        );

        // Add tables.
        client.query(
            `CREATE TABLE IF NOT EXISTS module(
                moduleId SERIAL NOT NULL, 
                name TEXT NOT NULL, 
                PRIMARY KEY(moduleId)
            );`
        );
        client.query(
            `CREATE TABLE IF NOT EXISTS attendance(
                  attendanceId SERIAL NOT NULL,
                  moduleId SERIAL NOT NULL, 
                  arrivalTime INTEGER NOT NULL, 
                  departureTime INTEGER, 
                  PRIMARY KEY(attendanceId), 
                  CONSTRAINT fk_moduleId FOREIGN KEY(moduleId) REFERENCES module (moduleId)
            );`
        );

        // Add data.
        client.query("INSERT INTO module(name) VALUES('Module Name 1');");

        client.query(
            "INSERT INTO attendance(moduleId, arrivalTime, departureTime) VALUES(1, 1, 2) ;"
        );
    })
    .catch(() => {
        console.log("Database was unable to connect.");
    });

module.exports = client;
