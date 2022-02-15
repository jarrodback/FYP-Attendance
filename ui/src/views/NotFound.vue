<template>
    <center>
        <h1>404: Page Not Found</h1>
        <p>
            You will be redirect in 5 seconds...
        </p><br>
        <p>
            Click <b-link v-on:click="redirect">here</b-link> if you aren't redirected</p>
    </center>
</template>

<script>
/**
 * View to control if a user navigates to a route that is invalid.
 */
export default {
    name: "NotFound",

    /**
     * On navigation, redirect the user after 5 seconds.
     */
    created() {
        setTimeout(() => this.redirect(), 5000);
    },

    methods: {
        /**
         * Redirect the user to the previous page.
         */
        redirect() {
            this.$router.back();
        },
    },
};
</script>

<style scoped>
center {
    margin: 15vw;
}
</style>
