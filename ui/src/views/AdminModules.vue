<template>

    <div>
        <h1>Modules</h1>
        <view-modules></view-modules>
    </div>

</template>

<script>
import Modules from "../components/MyModules.vue";

/**
 * View to control what a user views when viewing their requests.
 */
export default {
    name: "modules",

    components: {
        "view-modules": Modules,
    },
};
</script>
