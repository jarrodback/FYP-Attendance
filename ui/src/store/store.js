import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";

// Enable the store by passing it into Vue.
Vue.use(Vuex);

/**
 * Create the store to use.
 */
export const store = new Vuex.Store({
    plugins: [
        // Handle storing and retrieving data from the session storage
        // as the store is stateless.
        createPersistedState({
            storage: sessionStorage,
        }),
    ],
    /**
     * The data to store in the store.
     */
    state: {
        // Is the user logged in.
        loggedIn: false,

        // The user object.
        user: {
            id: null,
            email: null,
            username: null,
            type: null,
        },
    },

    /**
     * Setters for the stored data.
     */
    mutations: {
        // Set logged in variable.
        setLoggedIn(state, payload) {
            state.loggedIn = payload;
        },

        // Set the user object.
        setUser(state, payload) {
            state.user = payload;
        },

        // Set the id object on the user.
        setId(state, payload) {
            state.user.id = payload;
        },

        // Set the email on the user.
        setEmail(state, payload) {
            state.user.email = payload;
        },

        // Set the username on the user.
        setUsername(state, payload) {
            state.user.username = payload;
        },

        // Set the type on the user.
        setType(state, payload) {
            state.user.type = payload;
        },
    },

    /**
     * Getters for the stored data.
     */
    getters: {
        // Get the user data stored.
        user: (state) => {
            return state.user;
        },

        // Get the logged in data stored.
        loggedIn: (state) => {
            return state.loggedIn;
        },
    },
});
