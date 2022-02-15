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

                <template #cell(onTarget)="data">
                    <b-form-checkbox
                        v-model="data.item.onTarget"
                        @change="test(data)"
                    >
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
export default {
    name: "my-modules",

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
                    key: "attendanceScore",
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
            // List of modules //TODO: Remove hardcoded data
            modules: [
                { name: "Module 1", attendanceScore: 40, onTarget: false },
                { name: "Module 2", attendanceScore: 100, onTarget: true },
                { name: "Module 3", attendanceScore: 80, onTarget: true },
                { name: "Module 4", attendanceScore: 10, onTarget: false },
                { name: "Module 5", attendanceScore: 0, onTarget: false },
            ],

            // Default field to sort by.
            sortBy: "attendanceScore",

            // Sort by descending by default.
            sortDesc: false,
        };
    },

    methods: {
        test(data) {
            console.log(data);
        },
    },
};
</script>