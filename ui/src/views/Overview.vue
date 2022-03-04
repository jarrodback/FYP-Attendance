<template>

    <div>
        <h1>Overview</h1>
        <my-modules
            ref=myModules
            @openCreateModal="openCreateModal"
        ></my-modules>
        <create-modal
            ref=createModal
            @refreshModules="refreshModules"
        ></create-modal>
    </div>

</template>

<script>
import Modules from "../components/Modules.vue";
import CreateModal from "../components/CreateTargetModal.vue";
import { store } from "../store/store";

/**
 * View to control what a user views when viewing their requests.
 */
export default {
    name: "overview",

    components: {
        "my-modules": Modules,
        "create-modal": CreateModal,
    },

    computed: {
        getUsername() {
            return store.getters.user.username;
        },
    },

    methods: {
        refreshModules() {
            this.$refs.myModules.getModules();
        },
        openCreateModal(targets) {
            this.$refs.createModal.openCreateModal(targets);
        },
    },
};
</script>
