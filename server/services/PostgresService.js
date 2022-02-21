class PostgresService {
    /**
     * @description Create an instance of the PostgresService.
     */

    constructor(model) {
        this.model = model;
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
    async findAll(params) {
        return this.model.findAll(params);
    }
}

module.exports = PostgresService;
