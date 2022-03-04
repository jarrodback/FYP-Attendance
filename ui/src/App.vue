<template>
    <div id="app">
        <div>
            <nav-bar></nav-bar>
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
import NavBar from "@/components/Navbar.vue";
import { store } from "./store/store";

export default {
    name: "App",
    components: {
        SidebarMenu,
        "nav-bar": NavBar,
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
                    hidden: !this.isUserStudent(),
                },
                {
                    href: "/overview",
                    title: "Overview",
                    icon: "fa fa-book-open",
                    hidden: !this.isUserStudent(),
                },
                {
                    href: "/analytics",
                    title: "Analytics",
                    icon: "fa fa-chart-pie",
                    hidden: !this.isUserStudent(),
                },
                {
                    href: "/activity",
                    title: "Activity",
                    icon: "fa fa-chart-line",
                    hidden: !this.isUserStudent(),
                },
                {
                    header: true,
                    title: "Admin",
                    hiddenOnCollapse: false,
                    hidden: !this.isUserAdmin(),
                },
                {
                    href: "/modules",
                    title: "My Modules",
                    icon: "fa fa-book",
                    hidden: !this.isUserAdmin(),
                },
            ],
        };
    },

    methods: {
        isUserAdmin() {
            return store.getters.user.type == "Lecturer";
        },
        isUserStudent() {
            return store.getters.user.type == "Student";
        },
    },
};
</script>

<style>
.vsm--item {
    margin: 10px;
}
</style>