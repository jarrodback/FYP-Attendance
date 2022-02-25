<template>
    <div>
        <b-navbar
            toggleable="lg"
            type="light"
        >
            <b-collapse
                id="nav-collapse"
                is-nav
            >
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template #button-content>
                            <em>{{getUsername}}</em>
                        </template>
                        <b-dropdown-item
                            href="#"
                            v-on:click="signOut()"
                        >Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
/**
 * Component to show the navbar.
 */
import { store } from "@/store/store";
import { api } from "../middleware/helpers/api";

export default {
    name: "nav-bar",

    computed: {
        getUsername() {
            return store.getters.user.username;
        },
    },

    methods: {
        /**
         * Sign the user out.
         */
        signOut() {
            api.logout().then(() => {
                store.commit("setLoggedIn", false);
                store.commit("setUser", {});
                sessionStorage.clear();
                this.$router.push("/overview").catch(() => {});
            });
        },
    },
};
</script>