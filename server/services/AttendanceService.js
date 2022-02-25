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

        //TODO:
        //Search through modules and find where time is in the time slot.
        //Get the module ID, and append it to the attendance record.
        //Update the user's activity with the time they checked in and the module id.
        let query = {
            where: { UserId: attendance.UserId },
        };

        return moduleUserModel
            .findAll(query)
            .then((attendanceList) => {
                let modules = [];
                for (let x = 0; x < attendanceList.length; x++) {
                    modules.push(attendanceList[x].dataValues.ModuleId);
                }
                let query = {
                    where: { id: modules },
                };
                return moduleModel.findAll(query).then((moduleList) => {
                    let attendingModule;
                    for (let x = 0; x < moduleList.length; x++) {
                        const startTime = new Date(
                            moduleList[x].dataValues.startTime
                        );
                        const endTime = new Date(
                            moduleList[x].dataValues.endTime
                        );
                        const arrivalTime = new Date(attendance.arrivalTime);
                        const isBetween =
                            startTime <= arrivalTime && endTime >= arrivalTime;

                        if (isBetween) attendingModule = moduleList[x];
                    }

                    if (!attendingModule) {
                        throw httpError(
                            400,
                            "The user does not belong to any module at the specified time. Attendance not registered."
                        );
                    } else {
                        const record = {
                            ModuleId: attendingModule.dataValues.id,
                            UserId: attendance.UserId,
                            arrivalTime: attendance.arrivalTime,
                        };
                        return this.postgresService
                            .create(record)
                            .then(() => {
                                return userModel
                                    .findByPk(record.UserId)
                                    .then((data) => {
                                        let query = {
                                            where: {
                                                id: record.UserId,
                                            },
                                        };
                                        let newActivity =
                                            data.dataValues.activity;
                                        newActivity.push({
                                            module: attendingModule.dataValues
                                                .name,
                                            attendedAt: record.arrivalTime,
                                        });
                                        let to_update = {
                                            activity: newActivity,
                                        };
                                        return userModel
                                            .update(to_update, query)
                                            .then(() => {
                                                let query = {
                                                    where: {
                                                        UserId: record.UserId,
                                                        ModuleId:
                                                            record.ModuleId,
                                                    },
                                                };
                                                return moduleUserModel
                                                    .findOne(query)
                                                    .then((moduleUser) => {
                                                        let newAttendedSessions =
                                                            moduleUser.attendedSessions ??
                                                            0;
                                                        newAttendedSessions++;
                                                        let to_update = {
                                                            attendedSessions:
                                                                newAttendedSessions,
                                                        };

                                                        let query = {
                                                            where: {
                                                                UserId: record.UserId,
                                                                ModuleId:
                                                                    record.ModuleId,
                                                            },
                                                        };
                                                        return moduleUserModel.update(
                                                            to_update,
                                                            query
                                                        );
                                                    });
                                            });
                                    });
                            })
                            .catch((error) => {
                                throw httpError(500, error.message);
                            });
                    }
                });
            })
            .catch((error) => {
                throw httpError(error.status, error.message);
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
