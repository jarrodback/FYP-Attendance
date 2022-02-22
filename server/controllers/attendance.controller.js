const AttendanceService = require("../services/AttendanceService.js");
const attendanceService = new AttendanceService();

/**
 * Find all Attendance data from the database
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findAll = (req, res) => {
    const url = new URL(
        req.protocol + "://" + req.get("host") + req.originalUrl
    );

    let params = new URLSearchParams(url.search);
    params = Object.fromEntries(params);

    attendanceService
        .findAll(params)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(err.status).send({
                message: err.message,
            });
        });
};

/**
 * Find Attendance based on the id provided
 * @param {Object} req The Attendance being sent
 * @param {Object} res The response returned
 */
exports.findOne = (req, res) => {
    // Get the Attendance Id from the body
    attendanceService
        .findOne(req.params.id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: "Attendance data does not exist.",
                });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Create a new Attendance record
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */

exports.create = (req, res) => {
    attendanceService
        .createAttendance(req.body)
        .then(() => {
            console.log("Attendance has been recorded.");

            res.status(200).send({
                message: "Attendance was successfully created.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({
                message: err.message,
            });
        });
};

/**
 * Update a Attendance based on the id provided
 * @param {Object} req The attendance being sent
 * @param {Object} res The response returned
 */
exports.update = (req, res) => {
    attendanceService
        .updateAttendance(req.params.id, req.body)
        .then(() => {
            res.status(200).send({
                message: "Attendance was successfully updated.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Delete a Attendance based on the id provided
 * @param {Object} req The attendance being sent
 * @param {Object} res The response returned
 */
exports.delete = (req, res) => {
    attendanceService
        .deleteAttendance(req.params.id)
        .then(() => {
            res.status(200).send({
                message: "Attendance was successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Delete all Attendances
 * @param {Object} req The attendance being sent
 * @param {Object} res The response returned
 */
exports.deleteAll = (req, res) => {
    attendanceService
        .deleteAllAttendance()
        .then(() => {
            res.status(200).send({
                message: "Attendances were successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing the Attendances.",
            });
        });
};
