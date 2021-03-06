const PostgresService = require("./PostgresService.js");
const model = require("../models/index").user;
const moduleModel = require("../models/index").module;
const moduleUserModel = require("../models/index").moduleUser;
const httpError = require("http-errors");
const { attendance } = require("../models/index");
const isUUIDv4Valid =
    require("../middleware/validation/utilities").isUUIDv4Valid;

class UserService {
    /**
     * @description Create an instance of the UserService
     */

    constructor() {
        // Create an instance of the data layer.
        this.postgresService = new PostgresService(model);
    }

    /**
     * Find all User data
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
                    attributes: ["name", "numberOfSessions"],
                },
            ],
        };
        return this.postgresService.findAll(query).catch((error) => {
            throw httpError(500, error.message);
        });
    }

    /**
     * Find a user.
     *
     * @param {String} user The user to find
     * @returns {httpError} 200 If finding the User is successful.
     * @returns {httpError} 404 If no User is found.
     */
    async findUser(user) {
        if (!isUUIDv4Valid(user)) {
            throw httpError(400, "UUID is invalid.");
        }

        const query = {
            include: [
                {
                    model: moduleModel,
                    attributes: ["name"],
                },
            ],
        };
        return this.postgresService.findById(user, query).catch((error) => {
            throw httpError(500, error.message);
        });
    }

    /**
     * Create a user.
     *
     * @param {User} userToCreate The user to create.
     * @returns {httpError} 200 If creating the User is successful.
     * @returns {httpError} 404 If creatiing the User is unsuccessful.
     */
    async createUser(userToCreate) {
        if (!validateUser(userToCreate)) {
            throw httpError(400, "User data is invalid.");
        }
        const user = {
            username: userToCreate.username,
            email: userToCreate.email,
            type: userToCreate.type,
        };

        return this.postgresService.create(user).catch((error) => {
            if (error.errors[0].message.includes("username"))
                throw httpError(400, "Username is already in use.");
            if (error.errors[0].message.includes("email"))
                throw httpError(400, "Email is already in use.");
            throw httpError(500, error.message);
        });
    }

    /**
     * Update a user.
     *
     * @param {String} userToUpdate The user to update.
     * @param {Object} to_update The update body.
     * @returns {httpError} 200 If updating the User is successful.
     * @returns {httpError} 404 If user could not be updated.
     */
    async updateUser(userToUpdate, to_update) {
        if (!isUUIDv4Valid(userToUpdate)) {
            throw httpError(400, "UUID is invalid.");
        }

        const query = {
            where: { id: userToUpdate },
        };
        return this.postgresService
            .update(query, to_update)
            .then((data) => {
                if (data[0] == 0) {
                    throw httpError(200, "User does not exist.");
                }
            })
            .catch((error) => {
                throw httpError(404, error.message);
            });
    }

    /**
     * Find users in a module.
     *
     * @param {Object} params The params.
     * @returns {httpError} 200 If updating the User is successful.
     * @returns {httpError} 404 If user could not be updated.
     */
    async getModuleUsers(id) {
        let query = {
            where: { ModuleId: id },
        };
        return moduleUserModel
            .findAll(query)
            .then((data) => {
                let users = [];
                data.forEach((user) => {
                    users.push(user.dataValues.UserId);
                });
                query = {
                    where: { id: users },
                };
                return this.postgresService.findAll(query);
            })
            .catch((error) => {
                throw httpError(error.status || 500, error.message);
            });
    }

    /**
     * Update a user's link table.
     *
     * @param {String} userToUpdate The user to update.
     * @param {Object} to_update The update body.
     * @returns {httpError} 200 If updating the User is successful.
     * @returns {httpError} 404 If user could not be updated.
     */
    async updateModuleUser(body) {
        const query = {
            where: { UserId: body.UserId, ModuleId: body.ModuleId },
        };
        const to_update = {
            attendedSessions: body.attendedSessions,
            target: body.target,
        };
        return moduleUserModel
            .update(to_update, query)
            .then((data) => {
                if (data[0] == 0) {
                    throw httpError(200, "User does not exist.");
                }
            })
            .catch((error) => {
                throw httpError(error.status || 500, error.message);
            });
    }

    /**
     * Delete a user.
     *
     * @param {String} userToDelete The user to delete.
     * @returns {httpError} 200 If deleteing the User is successful.
     * @returns {httpError} 404 If user could not be deleted.
     */
    async deleteUser(userToDelete) {
        if (!isUUIDv4Valid(userToDelete)) {
            throw httpError(400, "UUID is invalid.");
        }
        const query = {
            where: {
                id: userToDelete,
            },
        };
        return moduleUserModel
            .destroy({
                where: {
                    UserId: userToDelete,
                },
            })
            .then(() => {
                return attendance
                    .destroy({
                        where: {
                            UserId: userToDelete,
                        },
                    })
                    .then(() => {
                        return this.postgresService
                            .deleteOne(query)
                            .then((data) => {
                                if (!data) {
                                    throw httpError(
                                        400,
                                        "User does not exist."
                                    );
                                }
                            })
                            .catch((error) => {
                                throw httpError(500, error.message);
                            });
                    });
            });
    }

    /**
     * Delete a user.
     *
     * @returns {httpError} 200 If deleteing the Users is successful.
     */
    async deleteAllUsers() {
        const query = {
            where: {},
        };
        // User module -> Attendance -> User
        return moduleUserModel.destroy(query).then(() => {
            return attendance.destroy(query).then(() => {
                return this.postgresService.deleteAll(query);
            });
        });
    }

    /**
     * Find a user's details with the google auth email.
     *
     * @param {Object} user The google user auth object.
     * @returns {httpError} 200 If finding the Users is successful.
     */
    async getUserGoogleLogin(user) {
        return this.findAll({ email: user.email })
            .then((data) => {
                if (data.length == 0) {
                    const newUser = {
                        username: `${user.name.givenName} ${user.name.familyName}`,
                        email: user.email,
                        type: "Student",
                    };
                    return this.createUser(newUser);
                } else {
                    // Email is unique so can safely assume index 0 is correct data.
                    return data[0];
                }
            })
            .catch((error) => {
                throw httpError(500, error.message);
            });
    }
}

/**
 *  Validates the data in the User.
 *
 * @returns {Boolean} True if the object maps correct to the User model.
 */
function validateUser(user) {
    return user && user.username && user.email && user.type;
}

module.exports = UserService;
