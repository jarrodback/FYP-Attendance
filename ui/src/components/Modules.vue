<template>
    <div>
        <h3> My Modules </h3>
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

                // Convert attendance value into percentage.
                for (let module of this.modules) {
                    this.module.attendanceRating =
                        (this.module.Module_User.attendedSessions /
                            this.modules.numberOfSessions) *
                        100;
                }
            });
        },
    },
};
</script>
<style>
h3 {
    text-align: left;
}
</style>