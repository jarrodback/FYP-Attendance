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
            req.userData.dataValues.google = req.user;

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
    // req.user = null;
    // req.userData = null;
    // req.logOut();
    // res.clearCookie("connect.sid");
    // res.clearCookie("attendanceSystem - token");
    // await req.logout();
    // res.clearCookie("connect", { path: "/", httpOnly: true });
    // res.clearCookie("attendanceSystem-token.sig", {
    //     path: "/",
    //     httpOnly: true,
    // });
    // res.clearCookie("attendanceSystem-token", { path: "/", httpOnly: true });

    req.session.destroy(function (e) {
        req.logout();
        res.status(200).send({
            message: "User was successfully logged out.",
        });
    });
};
