import { store } from "../../store/store";
import { api } from "../helpers/api";

/**
 * Check if the user transitioning the route is logged in.
 */
export const isAuthenticated = (to, from, next) => {
    if (store.state.loggedIn) {
        next();
    } else {
        api.getUserDetails()
            .then((data) => {
                store.commit("setLoggedIn", true);
                store.commit("setUser", {
                    id: data.data.id,
                    email: data.data.email,
                    username: data.data.username,
                    type: data.data.type,
                    modules: data.data.Modules,
                    google: data.data.google,
                });
                store.commit("setLoggedIn", true);
                next();
            })
            .catch(() => {
                window.location.href = "http://localhost:3050/auth/google";
            });
    }
};

/**
 * Check if the user transitioning the route is an admin.
 */
export const isAdmin = (to, from, next) => {
    if (store.getters.user.type == "Lecturer") {
        next();
    } else {
        next({ path: "/forbidden" });
    }
};

/**
 * Check if the user is an admin.
 */
export const isUserAdmin = () => {
    return store.getters.user.type == "Lecturer";
};

/**
 * Check if the user transitioning the route is a user.
 */
export const isUser = (to, from, next) => {
    isAuthenticated(to, from, next);
    if (store.getters.user.type == "Student") {
        next();
    } else {
        next({ path: "/forbidden" });
    }
};

/**
 * Check if the user transitioning the route is logged in.
 */
export const isLoggedOut = (to, from, next) => {
    if (store.state.loggedIn) {
        next({ path: "http://localhost:3050/auth/google" });
    } else {
        next();
    }
};
