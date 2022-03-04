<template>

    <div>
        <h1>Analytics</h1>
        <view-analytics
            :categories="categories"
            :data30Line="data30Line"
            :data30="data30"
            :dataAll="dataAll"
        ></view-analytics>
    </div>

</template>

<script>
import Analytics from "../components/Analytics.vue";
import { api } from "../middleware/helpers/api";

/**
 * View to control what a user views when viewing their Analytics.
 */
export default {
    name: "analytics",

    mounted() {
        this.getActivity();
    },

    components: {
        "view-analytics": Analytics,
    },

    data() {
        return {
            categories: [],
            data30Line: [],
            data30: [],
            dataAll: [],
        };
    },

    methods: {
        getActivity() {
            api.getUserDetails().then((result) => {
                // Group the array by attendedAt field to easily display the activity per day.
                const activities = result.data.activity.reduce(
                    (activities, item) => {
                        let attendedAtSplit = item.attendedAt;
                        if (item.attendedAt) {
                            attendedAtSplit = new Date(attendedAtSplit)
                                .toISOString()
                                .split("T")[0];
                        }
                        const activity = activities[attendedAtSplit] || [];
                        activity.push(item);
                        activities[attendedAtSplit] = activity;
                        return activities;
                    },
                    {}
                );

                this.activity = activities;
                this.calculateAnalytics();
            });
        },

        calculateAnalytics() {
            let attendanceLine = 0;
            let attended30 = 0;
            let missed30 = 0;
            let attendedAll = 0;
            let missedAll = 0;

            let currentDate = new Date();
            let previous30Date = new Date();
            previous30Date.setDate(previous30Date.getDate() - 30);

            for (let date in this.activity) {
                currentDate = new Date(date);
                // Get days in between
                let dayDifference =
                    currentDate.getTime() - previous30Date.getTime();
                dayDifference = dayDifference / (1000 * 3600 * 24);

                if (dayDifference <= 30) {
                    this.categories.push(date);

                    this.activity[date].forEach((module) => {
                        if (module.type == "Attended") {
                            attended30++;
                            attendedAll++;
                            attendanceLine++;
                        }
                        if (module.type == "Missed") {
                            missed30++;
                            missedAll++;
                        }
                    });
                    this.data30Line.push(attendanceLine);
                } else {
                    this.activity[date].forEach((module) => {
                        if (module.type == "Attended") {
                            attendedAll++;
                        }
                        if (module.type == "Missed") {
                            missedAll++;
                        }
                    });
                }
            }

            this.dataAll.push(attendedAll);
            this.dataAll.push(missedAll);

            this.data30.push(attended30);
            this.data30.push(missed30);
        },
    },
};
</script>
