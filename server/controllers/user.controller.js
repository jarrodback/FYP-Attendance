const UserService = require("../services/UserService.js");
const userService = new UserService();

/**
 * Find all User data from the database
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

/**
 * Find a User based on the id provided
 * @param {Object} req The user being sent
 * @param {Object} res The response returned
 */
exports.findOne = (req, res) => {
    // Get the user Id from the body
    userService
        .findUser(req.params.id)
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: "User does not exist." });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Create a new User and save to the database
 * @param {Object} req The user being sent
 * @param {Object} res The response returned
 */
exports.create = (req, res) => {
    userService
        .createUser(req.body)
        .then((data) => {
            console.log("User has been saved in the database: " + data);

            res.status(200).send({
                message: "User was successfully created.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Update a User based on the id provided
 * @param {Object} req The user being sent
 * @param {Object} res The response returned
 */
exports.update = (req, res) => {
    userService
        .updateUser(req.params.id, req.body)
        .then(() => {
            res.status(200).send({
                message: "User was successfully updated.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Find all Module Users from the database
 * @param {Object} req The request being sent
 * @param {Object} res The response returned
 */
exports.findModuleUsers = (req, res) => {
    userService
        .getModuleUsers(req.params.id)
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
 * Update a User based body sent.
 * @param {Object} req The user being sent
 * @param {Object} res The response returned
 */
exports.updateModuleUser = (req, res) => {
    userService
        .updateModuleUser(req.body)
        .then(() => {
            res.status(200).send({
                message: "User was successfully updated.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Delete a User based on the id provided
 * @param {Object} req The user being sent
 * @param {Object} res The response returned
 */
exports.delete = (req, res) => {
    userService
        .deleteUser(req.params.id)
        .then(() => {
            res.status(200).send({
                message: "User was successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(err.status).send({ message: err.message });
        });
};

/**
 * Delete all Users
 * @param {Object} req The user being sent
 * @param {Object} res The response returned
 */
exports.deleteAll = (req, res) => {
    userService
        .deleteAllUsers()
        .then(() => {
            res.status(200).send({
                message: "Users were successfully deleted.",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "An error occurred while deleteing the Users.",
            });
        });
};
