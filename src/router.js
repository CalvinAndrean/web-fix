import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path){
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            meta: {title: 'Dashboard'},
            name:"Login",
            component: importComponent("DashboardLayout"),
            children:[
                {
                    path: "/",
                    meta: {title: 'Dashboard Index'},
                    name: "Root",
                    component: importComponent("DashboardIndex"),
                },

                {
                    path: "/login",
                    meta: {title: 'Login'},
                    name: "Login",
                    component: importComponent("LoginPage"),
                },

                {
                    path: "/member",
                    meta: {title: 'Member Page'},
                    name: "MemberPage",
                    component: importComponent("views/MemberPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/pegawai",
                    meta: {title: 'Pegawai Page'},
                    name: "PegawaiPage",
                    component: importComponent("views/PegawaiPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'MO'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/instructor",
                    meta: {title: 'Instructor Page'},
                    name: "InstructorPage",
                    component: importComponent("views/InstructorPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin')){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/class",
                    meta: {title: 'Class Page'},
                    name: "ClassPage",
                    component: importComponent("views/ClassPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'MO'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/class_running",
                    meta: {title: 'Class Running Page'},
                    name: "ClassRunningPage",
                    component: importComponent("views/ClassRunningPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Kasir') || localStorage.getItem('role') == 'MO'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/class_daily",
                    meta: {title: 'Class Daily Page'},
                    name: "ClassDailyPage",
                    component: importComponent("views/ClassDailyPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Kasir') || localStorage.getItem('role') == 'MO'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/activation_report",
                    meta: {title: 'Activation Report Page'},
                    name: "ActivationReportPage",
                    component: importComponent("views/ActivationReportPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/deposit_cash",
                    meta: {title: 'Deposit Cash Page'},
                    name: "Deposit Cash Report page",
                    component: importComponent("views/DepositCashReportPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/deposit_class_report",
                    meta: {title: 'Deposit Class Report Page'},
                    name: "Deposit Class Report page",
                    component: importComponent("views/DepositClassReportPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/instructor_absent",
                    meta: {title: 'Instructor Absent Page'},
                    name: "Instructor Absent page",
                    component: importComponent("views/InstructorAbsentPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/special_feature",
                    meta: {title: 'Special Feature Page'},
                    name: "Special Feature page",
                    component: importComponent("views/SpecialFeaturePage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                // {
                //     path: "/class_bookings",
                //     meta: {title: 'Class Booking Page'},
                //     name: "Special Feature page",
                //     component: importComponent("views/C"),
                //     beforeEnter: (to, from, next) => {
                //         if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                //             next();
                //         } else{
                //             next(false);
                //         }
                //     }
                // },

                {
                    path: "/presensi_kelas_member",
                    meta: {title: 'Presensi Kelas Member Page'},
                    name: "Presensi Kelas Member Rage",
                    component: importComponent("views/PresensiKelasMemberPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/gym_booking",
                    meta: {title: 'Gym Booking Page'},
                    name: "Gym Booking Rage",
                    component: importComponent("views/GymBookingPage"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/laporan_pendapatan_tahunan",
                    meta: {title: 'Laporan Pendapatan Tahunan Page'},
                    name: "Laporan Pendapatan Tahunan Page",
                    component: importComponent("views/LaporanPendapatanTahunan"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/laporan_aktivitas_kelas",
                    meta: {title: 'Laporan Aktivitas Kelas Page'},
                    name: "Laporan Aktivitas Kelas Page",
                    component: importComponent("views/LaporanAktivitasKelas"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/laporan_aktivitas_gym",
                    meta: {title: 'Laporan Aktivitas Gym Page'},
                    name: "Laporan Aktivitas Gym Page",
                    component: importComponent("views/LaporanAktivitasGym"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/laporan_kinerja_instructor",
                    meta: {title: 'Laporan Kinerja Instructor Page'},
                    name: "Laporan Kinerja Instructor Page",
                    component: importComponent("views/LaporanKinerjaInstructor"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },

                {
                    path: "/bar",
                    meta: {title: 'Bar Page'},
                    name: "Bar Page",
                    component: importComponent("views/Bar"),
                    beforeEnter: (to, from, next) => {
                        if((localStorage.getItem('role') == 'Admin') || localStorage.getItem('role') == 'Kasir'){
                            next();
                        } else{
                            next(false);
                        }
                    }
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

export default router;