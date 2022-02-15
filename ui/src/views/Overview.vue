<template>

    <div>
        <h1>Overview</h1>
        <my-modules></my-modules>
    </div>

</template>

<script>
import Modules from "../components/Modules.vue";

/**
 * View to control what a user views when viewing their requests.
 */
export default {
    name: "overview",

    components: {
        "my-modules": Modules,
    },
    mounted() {
        console.log("view");
    },
};
</script>
