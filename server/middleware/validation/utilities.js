const validate = require("uuid-validate");

/**
 * Check ID is a valid UUID.
 */
module.exports = {
    isUUIDv4Valid(UUID) {
        return validate(UUID, 4);
    },
};
