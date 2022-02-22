const UserService = require("../services/UserService.js");
const userService = new UserService();

exports.default = async (req, res) => {
    res.send({ message: "You are not logged in." });
};
exports.failure = async (req, res) => {
    res.send({ message: `Failed` });
};
exports.login = async (req, res) => {
    // Find user with that email.
    userService
        .getUserGoogleLogin(req.user)
        .then((data) => {
            req.userData = data;

            res.send({
                message: `Welcome ${req.user.email}  : ${req.user.name.givenName} : ${req.userData.email} : ${req.userData.username}`,
            });
        })
        .catch((err) => {
            res.status(err.status).send({
                message: err.message,
            });
        });
};
