<template>

    <div>
        <h1>Overview</h1>
        <my-modules></my-modules>
    </div>

</template>

<script>
import Modules from "../components/Modules.vue";
import { store } from "../store/store";

/**
 * View to control what a user views when viewing their requests.
 */
export default {
    name: "overview",

    components: {
        "my-modules": Modules,
    },

    computed: {
        getUsername() {
            return store.getters.user.username;
        },
    },
};
</script>
