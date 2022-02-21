class PostgresService {
    /**
     * @description Create an instance of the PostgresService.
     */

    constructor(model) {
        this.model = model;
    }

    /**
     * Find all records in the database Attendance table.
     *
     * @returns {Array[Object]} The found records.
     */
    async findAll(query) {
        return this.model.findAll(query);
    }

    /**
     * Find a record by ID in the database.
     *
     * @param {String} record The ID to find.
     * @returns {Object} The found record.
     * @returns {Error} The record could not be found.
     */
    async findById(record, query) {
        return this.model.findByPk(record, query);
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
     * Update a record by ID in the database.
     *
     * @param {String} recordToUpdate The ID to update.
     * @param {Object} to_update The data to update.
     * @returns {Object} The updated record.
     * @returns {Error} The record could not be found.
     */
    async update(query, to_update) {
        return this.model.update(to_update, query);
    }

    /**
     * Delete a record by ID in the database.
     *
     * @param {String} query The query to delete the ID.
     * @returns {Object} The ackowledgement of a deleted record.
     * @returns {Error} The record could not be found.
     */
    async deleteOne(query) {
        return this.model.destroy(query);
    }

    /**
     * Delete all records in the database.
     *
     * @param {String} query The query to delete all records.
     * @returns {Object} The ackowledgement of all deleted records.
     */
    async deleteAll(query) {
        return this.model.destroy(query);
    }
}

module.exports = PostgresService;
