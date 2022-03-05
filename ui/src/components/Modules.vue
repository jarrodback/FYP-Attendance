<template>
    <div>
        <div class="submit-btn">
            <b-button
                variant="info"
                v-on:click="openModal"
            > Set Target </b-button>
        </div>
        <h3 class="h3-overview"> My Modules </h3>

        <div class="overflow-auto center">
            <b-table
                id="module-table"
                striped
                :items="modules"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                responsive="sm"
            >

                <template #cell(attendanceRating)="data">
                    {{data.item.attendanceRating}}%
                </template>

                <template
                    #cell(target)="data"
                    class="small"
                >
                    <b-form-checkbox
                        v-if="targetExists(data.item)"
                        :checked='data.item.target'
                        class="mb-3"
                        :disabled="true"
                    ></b-form-checkbox>
                    <b-progress v-if="!targetExists(data.item)">
                        <b-progress-bar
                            :value="data.item.attendanceRating"
                            :max="data.item.Module_User.target"
                            show-progress
                            animated
                            variant="danger"
                        ><span>Progress: {{data.item.attendanceRating}}/{{data.item.Module_User.target}}%</span></b-progress-bar>
                    </b-progress>
                </template>

            </b-table>
        </div>
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
                { key: "name", sortable: true, label: "Module Name" },
                {
                    key: "attendanceRating",
                    sortable: true,
                    label: "Attendance Rating",
                },
                { key: "target", label: "Target" },
            ];
        },
    },

    data() {
        return {
            modules: [],

            // Default field to sort by.
            sortBy: "attendanceScore",

            // Sort by descending by default.
            sortDesc: false,
        };
    },

    methods: {
        getModules() {
            api.getUserDetails().then((data) => {
                this.modules = data.data.Modules;

                // Convert attendance value into percentage and check if on target.
                for (let module of this.modules) {
                    module.attendanceRating =
                        (module.Module_User.attendedSessions /
                            module.numberOfSessions) *
                        100;

                    if (module.Module_User.target) {
                        module.target =
                            module.attendanceRating >=
                            module.Module_User.target;
                    }
                }
            });
        },
        targetExists(item) {
            return item.target != null && item.target;
        },
        openModal() {
            this.$emit("openCreateModal", this.modules);
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