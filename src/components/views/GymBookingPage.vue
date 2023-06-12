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
                    <v-list-item-title class="headline">Gym Booking Page</v-list-item-title>
                    <v-list-item-subtitle>Gym</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="gym_bookings" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="presensi(item)"> Presensi </v-btn>                   
                    <v-btn small class="mr-2 red lighten-3" @click="cetakReport(item)"> Print Report </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <br><br><br>

        <v-dialog v-model="dialog" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin presensi member ini?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmPresensi">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelPresensi">Tidak</v-btn>
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
            dialogShow: false,
            expired_date: null,
            headers: [
                {
                    text: "ID Gym Booking",
                    align: "start",
                    sortable: true,
                    value: "id_gym_booking",
                    class: "yellow lighten-1"
                },
                { text: "ID Gym Session", value: "id_gym_session", class: "yellow lighten-1" },
                { text: "Start Time", value: "gym_session.start_time", class: "yellow lighten-1" },
                { text: "End Time", value: "gym_session.end_time", class: "yellow lighten-1" },
                { text: "Fullname Member", value: "member.fullname", class: "yellow lighten-1" },
                { text: "Datetime Booking", value: "datetime_booking", class: "yellow lighten-1" },
                { text: "Datetime Presensi", value: "datetime_presensi", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },

            ],
            gym_bookings: [],
            snackbar: {
                show: false,
                color: '',
                icon: '',
                message: '',
            },
            id_gym_booking: null,
        };
    },
    methods: {
        getGymBooking(){
            axios.get("http://calvin.ppcdeveloper.com/api/gym_bookings")
            .then((response) => {
                this.gym_bookings = response.data.data;
                console.log(this.gym_bookings);
                // this.snackbar.show = true;
                // this.snackbar.color = 'success';
                // this.snackbar.icon = 'mdi-check';
                // this.snackbar.message = 'Berhasil retrieve data';
                this.dialogTambah = false;
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
        },
        presensi(item){
            this.id_gym_booking = item.id_gym_booking;
            this.dialog = true;
        },
        cancelPresensi(){
            this.dialog = false;
        },
        confirmPresensi(){
            axios.put("http://calvin.ppcdeveloper.com/api/gym_bookings/" + this.id_gym_booking, {
            }).then((response) => {
                console.log(response)
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil presensi member';
                this.dialog = false;
                //reload
                this.getGymBooking();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialog = false;
        },
        cetakReport(item){
            axios.get("http://calvin.ppcdeveloper.com/api/gym_bookings/printReport/" + item.id_gym_booking, {
            }).then((response) => {
                console.log(response);
                console.log('Print report');
            }).catch((error) => {
                console.log(error)
            });
        },
    },
    mounted(){
        this.getGymBooking();
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