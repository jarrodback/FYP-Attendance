<template>
    <div id="app">
        <div>
            <sidebar-menu
                :menu="menu"
                :hideToggle="true"
                :width="'250px'"
            />
            <router-view />
        </div>
    </div>

</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";

export default {
    name: "App",
    components: {
        SidebarMenu,
    },

    data() {
        return {
            menu: [
                {
                    header: true,
                    title: "Attendance System",
                    hiddenOnCollapse: false,
                },
                {
                    header: true,
                    title: "Main",
                    hiddenOnCollapse: false,
                },
                {
                    href: "/overview",
                    title: "Overview",
                    icon: "fa fa-book-open",
                },
                {
                    href: "/analytics",
                    title: "Analytics",
                    icon: "fa fa-chart-pie",
                },
                {
                    href: "/activity",
                    title: "Activity",
                    icon: "fa fa-chart-line",
                },
                {
                    header: true,
                    title: "Admin",
                    hiddenOnCollapse: false,
                },
                {
                    href: "/modules",
                    title: "My Modules",
                    icon: "fa fa-book",
                },
                {
                    href: "/checkin",
                    title: "Check-in",
                    icon: "fa fa-calendar-check",
                },
            ],
        };
    },
};
</script>

<style>
.vsm--item {
    margin: 10px;
}
</style>