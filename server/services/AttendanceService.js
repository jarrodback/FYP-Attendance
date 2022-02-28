const PostgresService = require("./PostgresService.js");
const model = require("../models/index").attendance;
const moduleModel = require("../models/index").module;
const userModel = require("../models/index").user;
const moduleUserModel = require("../models/index").moduleUser;
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

        let query = {
            where: { UserId: attendance.UserId },
        };

        return moduleUserModel
            .findAll(query)
            .then((attendanceList) => {
                let modules = [];
                for (let module of attendanceList) {
                    modules.push(module.dataValues.ModuleId);
                }
                query = {
                    where: { id: modules },
                };
                return this.getUserModuleInformation(query, attendance)
                    .then((attendingModule) => {
                        const record = {
                            ModuleId: attendingModule.dataValues.id,
                            UserId: attendance.UserId,
                            arrivalTime: attendance.arrivalTime,
                        };

                        return this.postgresService.create(record).then(() => {
                            this.updateUserActivityAndSession(
                                record,
                                attendingModule
                            ).then(() => {
                                query = {
                                    where: {
                                        UserId: record.UserId,
                                        ModuleId: record.ModuleId,
                                    },
                                };
                                return this.findAndUpdateModuleUser(
                                    query,
                                    record
                                );
                            });
                        });
                    })
                    .catch((error) => {
                        throw httpError(500, error.message);
                    });
            })
            .catch((error) => {
                throw httpError(error.status || 500, error.message);
            });
    }

    /**
     * Find the module that the user is registering to.
     *
     * @param {Request} query The query to search the database for.
     * @param {Request} attendance The attendance data sent from the rfid-reader.
     * @returns {Promise} The request promise.
     * @returns {httpError} 400 If no module is found.
     */
    async getUserModuleInformation(query, attendance) {
        return moduleModel.findAll(query).then((moduleList) => {
            let attendingModule;
            for (let module of moduleList) {
                const startTime = new Date(module.dataValues.startTime);
                const endTime = new Date(module.dataValues.endTime);
                const arrivalTime = new Date(attendance.arrivalTime);
                const isBetween =
                    startTime <= arrivalTime && endTime >= arrivalTime;

                if (isBetween) attendingModule = module;
            }

            if (!attendingModule) {
                throw httpError(
                    400,
                    "The user does not belong to any module at the specified time. Attendance not registered."
                );
            }
            return attendingModule;
        });
    }

    /**
     * Find and update the User's activity and session count.
     *
     * @param {Request} record The attendance record.
     * @param {Request} attendingModule The attendance data to register.
     * @returns {Promise} The request promise.
     */
    async updateUserActivityAndSession(record, attendingModule) {
        return userModel.findByPk(record.UserId).then((data) => {
            let query = {
                where: {
                    id: record.UserId,
                },
            };
            let newActivity = data.dataValues.activity;
            newActivity.push({
                module: attendingModule.dataValues.name,
                attendedAt: record.arrivalTime,
            });
            let to_update = {
                activity: newActivity,
            };
            return userModel.update(to_update, query);
        });
    }

    /**
     * Find and update the User's activity and session count.
     *
     * @param {Request} query The query to search the database with.
     * @param {Request} record The attendance record.
     * @returns {Promise} The request promise.
     */
    async findAndUpdateModuleUser(query, record) {
        return moduleUserModel.findOne(query).then((moduleUser) => {
            let newAttendedSessions = moduleUser.attendedSessions ?? 0;
            newAttendedSessions++;

            let to_update = {
                attendedSessions: newAttendedSessions,
            };

            query = {
                where: {
                    UserId: record.UserId,
                    ModuleId: record.ModuleId,
                },
            };
            return moduleUserModel.update(to_update, query);
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
    return attendance && attendance.arrivalTime;
}

module.exports = AttendanceService;
