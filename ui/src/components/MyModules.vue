<template>
    <div>

        <b-card
            v-for="(modules, key) in modulesComputed"
            :key="key"
        >
            <h3 class="h3-overview"> {{modules.name}} </h3>

            <div class="overflow-auto center">
                <b-table
                    id="module-table"
                    striped
                    :items="modules.users"
                    :fields="fields"
                    responsive="sm"
                >
                </b-table>
            </div>
        </b-card>

    </div>
</template>
<script>
/**
 * Component to show the user's modules.
 */
import { api } from "../middleware/helpers/api";

export default {
    name: "my-modules",

    mounted() {
        this.getModules();
    },

    computed: {
        /**
         * Specify the fields that should be shown on the table.
         *
         * @returns {[String]} The list of table headers.
         */
        fields: function () {
            return [
                { key: "username", sortable: true, label: "Enrolled Students" },
            ];
        },

        modulesComputed: function () {
            return this.modules;
        },
    },

    data() {
        return {
            modules: [],
        };
    },

    methods: {
        getModules() {
            api.getUserDetails().then((data) => {
                this.modules = data.data.Modules;

                this.modules.forEach((module) => {
                    const moduleId = module.Module_User.ModuleId;
                    api.getAllUsersEnrolledInModule(moduleId).then((value) => {
                        module.users = value.data;
                    });
                });
            });
        },
    },
};
</script>
<style>
.h3-overview {
    text-align: left;
}
.submit-btn {
    float: right;
}
</style>