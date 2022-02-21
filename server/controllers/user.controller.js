const UserService = require("../services/UserService.js");
const userService = new UserService();

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

    userService
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
