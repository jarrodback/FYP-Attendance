const UserService = require("../services/UserService.js");
const userService = new UserService();

exports.failure = async (req, res) => {
    res.send({ message: `Failed` });
};

/**
 * Sign the user in.
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.details = async (req, res) => {
    // Find user with that email.
    userService
        .getUserGoogleLogin(req.user)
        .then((data) => {
            req.userData = data;

            res.send(req.userData);
        })
        .catch((err) => {
            res.status(err.status).send({
                message: err.message,
            });
        });
};

/**
 * Sign the user out.
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.logout = async (req, res) => {
    // Clear the user's cookie session.
    req.user = null;
    req.userData = null;

    res.status(200).send({
        message: "User was successfully logged out.",
    });
};
