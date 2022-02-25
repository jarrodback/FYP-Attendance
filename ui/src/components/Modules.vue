<template>
    <div>
        <h2> My Modules </h2>
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
                <template #cell(onTarget)="data">
                    <b-form-checkbox v-model="data.item.onTarget">
                    </b-form-checkbox>
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
                { key: "onTarget", label: "On Target" },
                "Actions",
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
                for (let x = 0; x < this.modules.length; x++) {
                    this.modules[x].attendanceRating =
                        (this.modules[x].Module_User.attendedSessions /
                            this.modules[x].numberOfSessions) *
                        100;
                }
            });
        },
    },
};
</script>