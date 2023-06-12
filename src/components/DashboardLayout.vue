<template>
    <div class="dashboard">
        <div class="sidebar">
            <div class="sidebar-scroll">
                <v-navigation-drawer class="fullheight" width="256" v-model="drawer"
                absolute temporary color="grey lighten-5">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title"> GoFit </v-list-item-title>
                            <v-list-item-subtitle>Gym to the core</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list dense nav v-if="admin">
                        <v-list-item
                            v-for="item in adminMenu"
                            :key="item.title"
                            link
                            color="light-blue-darken-4"
                            tag="router-link"
                            :to="item.to"
                        >
                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-list dense nav v-if="kasir">
                        <v-list-item
                            v-for="item in kasirMenu"
                            :key="item.title"
                            link
                            color="light-blue-darken-4"
                            tag="router-link"
                            :to="item.to"
                        >
                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-list dense nav v-if="mo">
                        <v-list-item
                            v-for="item in moMenu"
                            :key="item.title"
                            link
                            color="light-blue-darken-4"
                            tag="router-link"
                            :to="item.to"
                        >
                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </div>
        </div>

        <v-app-bar color="blue lighten-3" dark>
            <v-app-bar-nav-icon
            @click="drawer = true"
            color="white"></v-app-bar-nav-icon>
            <VSpacer />
        </v-app-bar>
        <div class="fullheight pa-5">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    export default {
        name: "DashboardIndex",
        data(){
            return{
                drawer: false,
                group: null,
                // items: [
                //     { title: "Dashboard", to: "/"},
                //     { title: "Member", to: "/member"},
                //     { title: "Pegawai", to: "/pegawai"},
                //     { title: "Instructor", to: "/instructor"},
                //     { title: "Class", to: "/class"},
                //     { title: "Class Running", to: "/class_running"},
                //     { title: "Class Daily", to: "/class_daily"},
                // ],
                adminMenu: [
                    { title: "Dashboard", to: "/"},
                    { title: "Member", to: "/member"},
                    { title: "Pegawai", to: "/pegawai"},
                    { title: "Instructor", to: "/instructor"},
                    { title: "Class", to: "/class"},
                    { title: "Class Running", to: "/class_running"},
                    { title: "Class Daily", to: "/class_daily"},
                    { title: "Activation Report", to: "/activation_report"},
                    { title: "Deposit Cash", to: "/deposit_cash"},
                    { title: "Deposit Class", to: "/deposit_class_report"},
                    { title: "Instructor Absent", to: "/instructor_absent"},
                    { title: "Special Feature", to: "/special_feature"},
                    { title: "Presensi Kelas Member", to: "/presensi_kelas_member"},
                    { title: "Class Running", to: "/class_running"},
                    // { title: "Laporan Pendapatan Tahunan", to: "/laporan_pendapatan_tahunan"},
                    // { title: "Laporan Aktivitas Kelas", to: "/laporan_aktivitas_kelas"},
                    // { title: "Laporan Aktivitas Gym", to: "/laporan_aktivitas_gym"},
                    // { title: "Laporan Kinerja Instructor", to: "/laporan_kinerja_instructor"},
                    // { title: "Bar", to: "/bar"},
                ],
                moMenu: [
                    { title: "Dashboard", to: "/"},
                    { title: "Class", to: "/class"},
                    { title: "Class Running", to: "/class_running"},
                    { title: "Class Daily", to: "/class_daily"},
                    { title: "Instructor Absent", to: "/instructor_absent"},
                ],
                kasirMenu: [
                    { title: "Dashboard", to: "/"},
                    { title: "Member", to: "/member"},
                    { title: "Activation Report", to: "/activation_report"},
                    { title: "Deposit Cash", to: "/deposit_cash"},
                    { title: "Deposit Class", to: "/deposit_class_report"},
                    { title: "Class Daily", to: "/class_daily"},
                    { title: "Instructor Absent", to: "/instructor_absent"},
                    { title: "Special Feature", to: "/special_feature"},
                    { title: "Presensi Kelas Member", to: "/presensi_kelas_member"},
                    { title: "Gym Booking", to: "/gym_booking"},
                    { title: "Class Running", to: "/class_running"},
                    { title: "Laporan Pendapatan Tahunan", to: "/laporan_pendapatan_tahunan"},
                    // { title: "Laporan Aktivitas Kelas", to: "/laporan_aktivitas_kelas"},
                    // { title: "Laporan Aktivitas Gym", to: "/laporan_aktivitas_gym"},
                    // { title: "Laporan Kinerja Instructor", to: "/laporan_kinerja_instructor"},
                    // { title: "Bar", to: "/bar"},
                ],
                admin: localStorage.getItem('role') == 'Admin',
                mo: localStorage.getItem('role') == 'MO',
                kasir: localStorage.getItem('role') == 'Kasir',
            };
        },
    };
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.sidebar {
  height: 100vh;
  overflow-y: auto;
}

.sidebar-scroll {
  height: 100%;
}
</style>