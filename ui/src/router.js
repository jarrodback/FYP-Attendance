import Vue from "vue";
import Router from "vue-router";

import Overview from "./views/Overview.vue";
import Activity from "./views/Activity.vue";
import Analytics from "./views/Analytics.vue";
import AdminModules from "./views/AdminModules.vue";
import NotFound from "./views/NotFound.vue";
import { isAuthenticated } from "./middleware/auth/auth";

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
        {
            path: "/",
            name: "overview",
            component: Overview,
            beforeEnter: isAuthenticated,
        },
        {
            path: "/overview",
            name: "overview",
            component: Overview,
            beforeEnter: isAuthenticated,
        },
        {
            path: "/activity",
            name: "activity",
            component: Activity,
            beforeEnter: isAuthenticated,
        },
        {
            path: "/analytics",
            name: "analytics",
            component: Analytics,
            beforeEnter: isAuthenticated,
        },
        {
            path: "/modules",
            name: "modules",
            component: AdminModules,
            beforeEnter: isAuthenticated,
        },
        // If a router not specified is entered, show not found page.
        {
            path: "/*",
            component: NotFound,
        },
    ],
});
