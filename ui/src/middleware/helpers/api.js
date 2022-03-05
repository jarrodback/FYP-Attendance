import axios from "axios";

/**
 * Constants that define the API urls.
 */
const BASE_AUTH_URL = "http://localhost:3050/auth/";
const BASE_AUTH_USER = "http://localhost:3050/api/v1/user/";

/**
 * Object that holds every API request.
 */
export const api = {
    /*********************************
     *            Auth               *
     ********************************/

    /**
     * Send a request to Login.
     *
     * @param {Object} payload The login data.
     * @returns {Promise}
     */
    getUserDetails: async () => {
        return axios.get(BASE_AUTH_URL + "details", {
            withCredentials: true,
        });
    },

    /**
     * Send a request to logout.
     *
     * @param {Object} payload The login data.
     * @returns {Promise}
     */
    logout: async () => {
        return axios.post(BASE_AUTH_URL + "logout", {
            withCredentials: true,
        });
    },

    /*********************************
     *            User               *
     ********************************/
    updateModuleUser: async (record) => {
        return axios.put(BASE_AUTH_USER + "module", record, {
            withCredentials: true,
        });
    },

    getAllUsersEnrolledInModule: async (moduleId) => {
        return axios.get(BASE_AUTH_USER + `module/${moduleId}`, {
            withCredentials: true,
        });
    },
};
