const PostgresService = require("./PostgresService.js");
const httpError = require("http-errors");

class AttendanceService {
    /**
     * @description Create an instance of the AttendanceService
     */

    constructor() {
        // Create an instance of the data layer.
        this.postgresService = new PostgresService();
        this.table = "attendance";
    }

    /**
     *  Find all attendance data
     *
     * @param {String} params The params to search for
     * @returns {httpError} 200 If finding the data is successful.
     * @returns {httpError} 404 If no data is found.
     */
    async findAll(params) {
        const id = params.orderBy ?? "attendanceId";
        const query = `SELECT * FROM ${this.table} ORDER BY ${id} ASC`;

        return this.postgresService.findAll(query).catch((error) => {
            throw httpError(404, error.message);
        });
    }
}

module.exports = AttendanceService;
