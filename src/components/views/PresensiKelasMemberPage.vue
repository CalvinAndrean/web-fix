<template>
    <v-main class="list">
        <link
            href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css"
            rel="stylesheet"
        /> 
        <v-card>
            <v-list-item>
                <v-list-item-avatar color="yellow darken-2"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">Presensi Kelas Member Page</v-list-item-title>
                    <v-list-item-subtitle>Presensi</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    outlined
                    hide
                    details
                    style="margin-top: 30px"
                ></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="class_running_dailies" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="insideClass(item)"> Inside Class </v-btn>                   
                    <!-- <v-btn small class="mr-2 red lighten-3" @click="showReport(item)"> Show Report </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="checkDepoClass(item)"> Show Deposit </v-btn> -->
                </template>
            </v-data-table>
        </v-card>
        <br><br><br>

        <v-dialog v-model="dialogShow" persistent width="auto">
            <v-card>
                <v-card-title>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        outlined
                        hide
                        details
                        style="margin-top: 30px"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                </v-card-title>
            </v-card>
            <v-card>
                <v-data-table :headers="headersClassBooking" :items="class_bookings" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <div v-if="item.datetime_presensi != null">
                        <v-btn small class="mr-2 red lighten-3" @click="cetakReport(item)"> Cetak Report </v-btn>           
                    </div>
                    <div v-if="item.datetime_presensi == null">
                        <v-btn small class="mr-2 red lighten-3" @click="cetakReport(item)" disabled> Cetak Report </v-btn>  
                    </div>
                </template>
            </v-data-table>
            <v-card-actions>
                    <v-btn color="red darken-2" text @click="closeDialogShow" style="margin-left: 1300px;">Close</v-btn>
                </v-card-actions>
        </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000" center bottom>
            <v-icon left>{{ snackbar.icon }}</v-icon>
            {{ snackbar.message }}
            <template v-slot:action="{ attrs }">
                <v-btn icon v-bind="attrs" @click="(snackbar.show = false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-main>
</template>
<script>
// import { reactive, ref } from "vue";
import axios from "axios";
// import { useRoute } from 'vue2-helpers/vue-router';
export default{
    name: "MemberPage",
    data() {
        return {
            search: null,
            dialog: false,
            dialogDepo: false,
            id_member: null,
            id_class_promo: null,
            dialogShow: false,
            expired_date: null,
            dialogShowDeposit: null,
            duration: null,
            headers: [
                {
                    text: "ID Class Daily",
                    align: "start",
                    sortable: true,
                    value: "id_class_running_daily",
                    class: "yellow lighten-1"
                },
                // { text: "ID Class Running", value: "id_class_running", class: "yellow lighten-1" },
                { text: "Instructor Name", value: "fullname", class: "yellow lighten-1" },
                { text: "Class Name", value: "class_name", class: "yellow lighten-1" },
                { text: "Start Time", value: "start_time", class: "yellow lighten-1" },
                { text: "Slot", value: "slot", class: "yellow lighten-1" },
                { text: "Day", value: "day", class: "yellow lighten-1" },
                { text: "Date", value: "date", class: "yellow lighten-1" },
                { text: "Status", value: "status", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            headersClassBooking: [
                {
                    text: "ID Class Booking",
                    align: "start",
                    sortable: true,
                    value: "id_class_booking",
                    class: "yellow lighten-1"
                },
                { text: "Class Name", value: "class_name", class: "yellow lighten-1" },
                { text: "Instructor", value: "fullname_instructor", class: "yellow lighten-1" },
                { text: "Fullname Member", value: "fullname_member", class: "yellow lighten-1" },
                { text: "Payment Type", value: "payment_type", class: "yellow lighten-1" },
                { text: "Datetime Presensi", value: "datetime_presensi", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },

            ],
            class_running_dailies: [],
            class_bookings: [],
            report: [],
            snackbar: {
                show: false,
                color: '',
                icon: '',
                message: '',
            },
        };
    },
    methods: {
        getClassRunningDaily(){
            axios.get("https://calvin.ppcdeveloper.com/api/class_running_dailies")
            .then((response) => {
                this.class_running_dailies = response.data.data;
                console.log(this.class_running_dailies);
            }).catch((error) => {
                console.log(error)
            });
        },
        cetakReport(item){
            console.log(item);
            if(item.payment_type == "Paket"){
                axios.get("https://calvin.ppcdeveloper.com/api/class_bookings/printReportDepositClass/" + item.id_class_booking)
                .then((response) => {
                    console.log(item.id_class_booking);
                    this.report = response.data.data;
                    console.log(this.report);
                }).catch((error) => {
                    console.log(error);
                });
            } else if(item.payment_type == "Cash"){
                axios.get("https://calvin.ppcdeveloper.com/api/class_bookings/printReportDepositCash/" + item.id_class_booking)
                .then((response) => {
                    console.log(item.id_class_booking);
                    this.report = response.data.data;
                    console.log(this.report);
                }).catch((error) => {
                    console.log(error);
                });
            }
        },
        insideClass(item){
            axios.get("https://calvin.ppcdeveloper.com/api/class_bookings/insideClass/" + item.id_class_running_daily)
            .then((response) => {
                this.class_bookings = response.data.data;
                console.log(this.class_bookings);
            }).catch((error) => {
                console.log(error);
            });
            this.dialogShow = true;
        },
        closeDialogShow(){
            this.dialogShow = false;
        }
    },
    mounted(){
        this.getClassRunningDaily();
        // this.getMembers();
    }
};
</script>
<style>
    .text {
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 40px;
        font-style: italic;
    }
</style>