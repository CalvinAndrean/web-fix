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
                    <v-list-item-title class="headline">Laporan Aktivitas Gym Page</v-list-item-title>
                    <v-list-item-subtitle>Laporan Aktivitas Gym</v-list-item-subtitle>
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
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="laporan_aktivitas_gym" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="getData(item)"> show </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px" style="background-color: white;">
            <v-card style="padding: 30px">
                <h7><b>
                    {{ data_laporan.title }} </b>
                </h7><br>
                <h7>
                    {{ data_laporan.address_gym }}
                </h7><br><br>
                <h7><b>LAPORAN PENDAPATAN BULANAN</b></h7><br>
                <h7>Bulan : {{data_laporan.bulan}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Tahun : {{ data_laporan.tahun }}</h7><br>
                <h7>Tanggal cetak&nbsp;&nbsp;&nbsp;&nbsp;: {{ data_laporan.tanggal_cetak }}</h7><br>
                <table style="border: 1px solid black;">
                    <tr>
                        <th width="165px" style="border: 1px solid black; padding: 5px;">Tanggal</th>
                        <th width="165px" style="border: 1px solid black; padding: 5px;">Jumlah Member</th>
                    </tr>

                    <tr v-for="item in data_laporan.aktivitas_gym" :key="item.month">
                        <td width="660px" style="border: 1px solid black; padding: 5px;">{{item.date}}</td>
                        <td width="660px" style="border: 1px solid black; padding: 5px;">{{item.jumlah_member}}</td>
                    </tr>
                </table>
                <v-card-actions>
                        <v-btn color="red darken-2" text @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000" center bottom>
            <v-icon left>{{ snackbar.icon }}</v-icon>
            {{ snackbar.message }}
            <template v-slot:action="{ attrs }">
                <v-btn icon v-bind="attrs" @click="(snackbar.show = false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar> -->
    </v-main>
</template>
<script>
// import { reactive, ref } from "vue";
import axios from "axios";
// import { useRoute } from 'vue2-helpers/vue-router';
export default{
    name: "LaporanPendapatanTahunan",
    data() {
        return {
            dialog: false,
            headers: [
                {
                    text: "ID Laporan Aktivitas Kelas",
                    align: "start",
                    sortable: true,
                    value: "id_laporan_aktivitas_kelas",
                    class: "yellow lighten-1"
                },
                { text: "Bulan", value: "bulan", class: "yellow lighten-1" },
                { text: "Tahun", value: "tahun", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            laporan_aktivitas_gym: [],
            data_laporan: [],
        };
    },
    methods: {
        closeDialog(){
            this.dialog = false;
        },
        getLaporanAktivitasGym(){
            axios.get("http://127.0.0.1:8000/api" + "/laporan_aktivitas_gym")
            .then((response) => {
                this.laporan_aktivitas_gym = response.data.data;
                console.log(this.laporan_pendapatan_tahunan)
            }).catch((error) => {
                console.log(error)
            });
        },
        getData(item){
            axios.get("http://127.0.0.1:8000/api" + "/laporan_aktivitas_gym/" + item.id_laporan_aktivitas_gym)
            .then((response) => {
                this.data_laporan = response.data.data;
                console.log(this.data_laporan)
            }).catch((error) => {
                console.log(error)
            });
            this.dialog = true;
        },
        cancel() {
            this.dialog = false;
        },
    },
    mounted(){
        this.getLaporanAktivitasGym();

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