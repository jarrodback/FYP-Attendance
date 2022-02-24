const PostgresService = require("./PostgresService.js");
const model = require("../models/index").attendance;
const moduleModel = require("../models/index").module;
const userModel = require("../models/index").user;
const httpError = require("http-errors");
const isUUIDv4Valid =
    require("../middleware/validation/utilities").isUUIDv4Valid;

class AttendanceService {
    /**
     * @description Create an instance of the AttendanceService
     */

    constructor() {
        // Create an instance of the data layer.
        this.postgresService = new PostgresService(model);
    }

    /**
     * Find all attendance data
     *
     * @param {String} params The params to search for
     * @returns {httpError} 200 If finding the data is successful.
     * @returns {httpError} 404 If no data is found.
     */
    async findAll(params) {
        const query = {
            where: params,
            include: [
                {
                    model: moduleModel,
                    attributes: ["name"],
                },
                {
                    model: userModel,
                    attributes: ["username", "email"],
                },
            ],
        };
        return this.postgresService.findAll(query).catch((error) => {
            throw httpError(500, error.message);
        });
    }

    /**
     * Find an Attendance.
     *
     * @param {String} attendance The Attendance to find
     * @returns {httpError} 200 If finding the Attendance is successful.
     * @returns {httpError} 404 If no Attendance is found.
     */
    async findOne(attendance) {
        if (!isUUIDv4Valid(attendance)) {
            throw httpError(400, "UUID is invalid.");
        }

        const query = {
            include: [
                {
                    model: moduleModel,
                    attributes: ["name"],
                },
                {
                    model: userModel,
                    attributes: ["username", "email"],
                },
            ],
        };
        return this.postgresService
            .findById(attendance, query)
            .catch((error) => {
                throw httpError(500, error.message);
            });
    }

    /**
     * Create and store an attendance record.
     *
     * @param {Request} attendance The attendance data to register.
     * @returns {httpError} 200 If creating the Attendance is successful.
     * @returns {httpError} 404 If creatiing the Attendance is unsuccessful.
     */
    async createAttendance(attendance) {
        if (!validateAttendance(attendance)) {
            throw httpError(400, "Attendance data is invalid.");
        }

        const record = {
            ModuleId: attendance.ModuleId,
            UserId: attendance.UserId,
            arrivalTime: attendance.arrivalTime,
            departureTime: attendance.departureTime ?? null,
        };

        return this.postgresService.create(record).catch((error) => {
            throw httpError(500, error.message);
        });
    }

    /**
     * Update Attendance.
     *
     * @param {String} attendanceToUpdate The Attendance to update.
     * @param {Object} to_update The update body.
     * @returns {httpError} 200 If updating the Attendance is successful.
     * @returns {httpError} 404 If Attendance could not be updated.
     */
    async updateAttendance(attendanceToUpdate, to_update) {
        if (!isUUIDv4Valid(attendanceToUpdate)) {
            throw httpError(400, "UUID is invalid.");
        }

        const query = {
            where: { id: attendanceToUpdate },
        };
        return this.postgresService
            .update(query, to_update)
            .then((data) => {
                if (data[0] == 0) {
                    throw httpError(200, "Attendance does not exist.");
                }
            })
            .catch((error) => {
                throw httpError(404, error.message);
            });
    }

    /**
     * Delete Attendance.
     *
     * @param {String} attendanceToDelete The Attendance to delete.
     * @returns {httpError} 200 If deleteing the Attendance is successful.
     * @returns {httpError} 404 If Attendance could not be deleted.
     */
    async deleteAttendance(attendanceToDelete) {
        if (!isUUIDv4Valid(attendanceToDelete)) {
            throw httpError(400, "UUID is invalid.");
        }
        const query = {
            where: {
                id: attendanceToDelete,
            },
        };
        return this.postgresService
            .deleteOne(query)
            .then((data) => {
                if (!data) {
                    throw httpError(400, "Attendance does not exist.");
                }
            })
            .catch((error) => {
                throw httpError(500, error.message);
            });
    }

    /**
     * Delete a Attendance.
     *
     * @returns {httpError} 200 If deleteing the Attendance is successful.
     */
    async deleteAllAttendance() {
        const query = {
            where: {},
        };
        return this.postgresService.deleteAll(query);
    }
}

/**
 * Validates the data for the attendance record.
 *
 * @returns {Boolean} True if the object maps correct to the Attendance model.
 */
function validateAttendance(attendance) {
    return attendance && attendance.arrivalTime && attendance.ModuleId
}

module.exports = AttendanceService;
