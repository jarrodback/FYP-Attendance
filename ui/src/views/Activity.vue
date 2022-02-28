<template>

    <div>
        <h1>Activity</h1>
        <view-activity></view-activity>
    </div>

</template>

<script>
import Activity from "../components/Activity.vue";

/**
 * View to control what a user views when viewing their requests.
 */
export default {
    name: "activity",

    components: {
        "view-activity": Activity,
    },
};
</script>
