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
    console.log("Requesting user details..");
    // Find user with that email.
    userService
        .getUserGoogleLogin(req.user)
        .then((data) => {
            console.log("Found user details", data);

            req.userData = data;
            req.userData.dataValues.google = req.user;

            res.send(req.userData);
        })
        .catch((err) => {
            console.log("Unable to locate details", err);
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
    await req.logOut();
    req.user = null;
    req.userData = null;
    res.clearCookie("connect.sid");
    res.clearCookie("attendanceSystem - token");
    res.clearCookie("attendanceSystem-token", { path: "/", httpOnly: true });
};
