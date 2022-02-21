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
 * Create a new Attendance record/
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */

exports.create = (req, res) => {
    attendanceService
        .createAttendance(req.body)
        .then(() => {
            console.log("Attendance has been recorded.");
        })
        .catch((err) => {
            res.status(err.status).send({
                message: err.message,
            });
        });
};
