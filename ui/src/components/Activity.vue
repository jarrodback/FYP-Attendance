<template>
    <div>
        <h2> Activity </h2>
        <div class="overflow-auto center">
            <p
                v-for="(activity, act) in this.activity"
                :key="act"
            >
                <!-- You attended {{activity.module}} at {{new Date(activity.arrivedAt).toISOString().split('T')[0]}} -->
            </p>

            <p> {{this.activity}} </p>
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
        };
    },

    methods: {
        getActivity() {
            api.getUserDetails().then((data) => {
                let userActivity = data.data.activity;

                // Convert the dates into a readable format.
                // for (let x = 0; x < userActivity.length; x++) {
                //     userActivity[x].arrivedAt = new Date(
                //         userActivity[x].arrivedAt
                //     )
                //         .toISOString()
                //         .split("T")[0];
                // }

                for (let x = 0; x < userActivity.length; x++) {
                    const arrivedAt = (userActivity[x].arrivedAt = new Date(
                        userActivity[x].arrivedAt
                    ));

                    const date = (userActivity[x].arrivedAt = new Date(
                        userActivity[x].arrivedAt
                    )
                        .toISOString()
                        .split("T")[0]);

                    const hour = arrivedAt.getHours();
                    const minute = arrivedAt.getMinutes();

                    if (this.activity[date]) {
                        this.activity[date].push({
                            module: userActivity[x].module,
                            arrivedAt: `${hour}:${minute}`,
                        });
                    } else {
                        this.activity[date] = [
                            {
                                module: userActivity[x].module,
                                arrivedAt: `${hour}:${minute}`,
                            },
                        ];
                    }
                }
            });
        },
    },
};
</script>