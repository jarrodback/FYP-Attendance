const Database = require("../database/config");

class PostgresService {
    /**
     * @description Create an instance of the PostgresService.
     */

    constructor() {
        // Import and set the pool query variable to access the database.
        this.dataAccess = Database;
    }

    /**
     * Create and save the record to the database.
     *
     * @param {Object} record The Request to create.
     * @returns {Object} The created record.
     */
    async create(query) {
        return this.dataAccess.query(query);
    }

    /**
     * Find all records in the database Attendance table.
     *
     * @returns {Array[Object]} The found records.
     */
    async findAll(query) {
        return this.dataAccess.query(query);
    }
}

module.exports = PostgresService;
