import Vue from "vue";
import App from "./App.vue";
import router from "./router";

/**
 * Import packages to aid with visuals.
 */
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueCompositionAPI from "@vue/composition-api";
import VueNotification from "@mathieustan/vue-notification";

/**
 * Import CSS style files.
 */
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/css/main.css";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "@fortawesome/fontawesome-free/css/all.css";

/**
 * Configure and enable the packages to use with vue.
 */
Vue.use(VueCompositionAPI);
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueNotification, {
    theme: {
        colors: {
            success: "#54d861",
            darkenSuccess: "#2d8e36",
            info: "#5d6a89",
            darkenInfo: "#535f7b",
            warning: "#f8a623",
            darkenWarning: "#f69a07",
            error: "#cc0000",
            darkenError: "#ff245f",
            offline: "#ff4577",
            darkenOffline: "#ff245f",
        },
    },
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
