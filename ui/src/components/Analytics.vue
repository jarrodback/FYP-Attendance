<template>
    <div>
        <b-card>
            <h4>Last 30 days</h4>
            <VueApexCharts
                height="250px"
                :options="options"
                :series="series30Pie.data"
                :title="series30Pie.name"
                type="pie"
            >
            </VueApexCharts>
            <VueApexCharts
                height="250px"
                :options="optionsLine"
                :series="series30"
                :title="series30.name"
                type="line"
            >
            </VueApexCharts>
        </b-card>

        <b-card>
            <h4>All time</h4>
            <VueApexCharts
                height="250px"
                :options="options"
                :series="seriesAll.data"
                :title="seriesAll.name"
                type="pie"
            >
            </VueApexCharts>
        </b-card>

    </div>
</template>
<script>
/**
 * Component to show the user's analytics.
 */
import VueApexCharts from "vue-apexcharts";

export default {
    name: "analytics",

    components: {
        VueApexCharts,
    },

    computed: {},

    props: {
        categories: [],
        data30Line: [],
        data30: [],
        dataAll: [],
    },

    data() {
        return {
            series30Pie: {
                name: "Analytics for attendance for the last 30 days",
                data: this.data30,
            },
            series30: [
                {
                    name: "Analytics for attendance for the last 30 days",
                    data: this.data30Line,
                },
            ],
            seriesAll: {
                name: "Analytics for attendance for all time",
                data: this.dataAll,
            },
            optionsLine: {
                noData: {
                    text: "No activity data to show...",
                },
                legend: {
                    position: "bottom",
                },
                xaxis: {
                    categories: this.categories,
                },
            },
            options: {
                labels: ["Attended", "Missed"],
                noData: {
                    text: "No activity data to show...",
                },
                legend: {
                    position: "bottom",
                },
                xaxis: {
                    categories: this.categories,
                },
            },

            activity: [],
        };
    },

    methods: {},
};
</script>
