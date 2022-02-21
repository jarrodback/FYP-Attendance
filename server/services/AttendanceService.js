const PostgresService = require("./PostgresService.js");
const model = require("../models/index").attendance;
const httpError = require("http-errors");

class AttendanceService {
    /**
     * @description Create an instance of the AttendanceService
     */

    constructor() {
        // Create an instance of the data layer.
        this.postgresService = new PostgresService(model);
    }

    /**
     *  Find all attendance data
     *
     * @param {String} params The params to search for
     * @returns {httpError} 200 If finding the data is successful.
     * @returns {httpError} 404 If no data is found.
     */
    async findAll(params) {
        return this.postgresService.findAll(params).catch((error) => {
            throw httpError(404, error.message);
        });
    }
}

module.exports = AttendanceService;
