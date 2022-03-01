<template>
    <div class="container">
        <div class="activity">
            <h3>Recent Activity</h3>
            <div class="activity-content">
                <div
                    class="date"
                    v-for="(date, key) in this.activity"
                    :key="key"
                >
                    <h4>{{key}} - {{new Date(date[0].attendedAt).toString().substring(0,3)}}</h4>

                    <div
                        v-for="(activity, activityKey) in date"
                        :key="activityKey"
                    >You <b><span
                                :style="attendedStyle(activity.type)"
                                v-if='isAttended(activity.type)'
                            >attended</span>
                            <span
                                :style="attendedStyle(activity.type)"
                                v-if='!isAttended(activity.type)'
                            >missed</span>
                        </b> <b>{{activity.module}}</b> at {{new Date(activity.attendedAt).toISOString().split('T')[1].split('.')[0]}}</div>

                </div>
            </div>
        </div>
        <div class="history">
            <h3>History</h3>

            <b-calendar
                v-model="value"
                :date-info-fn="dateClass"
                :date-disabled-fn="dateDisabled"
                locale="en"
                :hide-header='true'
                :readonly='true'
                block
            ></b-calendar>
        </div>
    </div>
</template>
<script>
/**
 * Component to show the user's activity.
 */
import { api } from "../middleware/helpers/api";

export default {
    name: "activity",

    mounted() {
        this.getActivity();
    },

    computed: {},

    data() {
        return {
            activity: [],

            // Default field to sort by.
            sortBy: "attendanceScore",

            // Sort by descending by default.
            sortDesc: false,

            value: "",
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
            });
        },

        dateClass(ymd, date) {
            const day = new Date(date).toISOString().split("T")[0];
            if (this.activity[day]) {
                let missed = false;
                this.activity[day].forEach((activity) => {
                    if (activity.type == "Missed") {
                        missed = true;
                    }
                });
                if (missed) return "table-danger";
                else return "table-success";
            }
            return " ";
        },

        dateDisabled(ymd, date) {
            const weekday = date.getDay();
            const day = date.getDate();
            return weekday === 0 || weekday === 6 || day === 13;
        },

        isAttended(type) {
            return type === "Attended";
        },
        attendedStyle(type) {
            if (type === "Attended") {
                return {
                    color: "green",
                };
            } else {
                return { color: "red" };
            }
        },
    },
};
</script>
<style>
h3 {
    text-align: center;
}
</style>