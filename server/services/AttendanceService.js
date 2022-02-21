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
            throw httpError(500, error.message);
        });
    }

    /**
     *  Create and store an attendance record.
     *
     * @param {Request} attendance The attendance data to register.
     * @returns {httpError} 200 If creating the Request is successful.
     * @returns {httpError} 404 If creatiing the Request is unsuccessful.
     */
    async createAttendance(attendance) {
        if (!validateAttendance(attendance)) {
            throw httpError(400, "Attendance data is invalid.");
        }

        const record = {
            ModuleId: attendance.ModuleId,
            arrivalTime: attendance.arrivalTime,
            departureTime: attendance.departureTime,
            createdAt: attendance.createdAt,
            updatedAt: attendance.updatedAt,
        };

        return this.postgresService.create(record).catch((error) => {
            throw httpError(500, error.message);
        });
    }
}

/**
 *  Validates the data for the attendance record.
 *
 * @returns {Boolean} True if the object maps correct to the Attendance model.
 */
function validateAttendance(attendance) {
    if (!attendance || !attendance.arrivalTime || !attendance.ModuleId) {
        return false;
    } else if (request.type != "Student" && request.type != "Lecturer") {
        return false;
    } else {
        return true;
    }
}

module.exports = AttendanceService;
