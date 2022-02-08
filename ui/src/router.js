import Vue from "vue";
import Router from "vue-router";

// Pass the router into Vue to use.
Vue.use(Router);

/**
 * Define the router and the paths.
 */
export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    linkActiveClass: "active",
    routes: [
        // Redirect to login page, must not be logged in.
        {
            path: "/",
            name: "login-user",
        },
    ],
});
