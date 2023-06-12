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
                    <v-list-item-title class="headline">Laporan Pendapatan Tahunan Page</v-list-item-title>
                    <v-list-item-subtitle>Laporan Pendapatan Tahunan</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="laporan_pendapatan_tahunan" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="getData(item)"> show </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px" style="background-color: white;">
            <v-card style="padding: 30px">
                <b>
                    {{ data_laporan.title }} </b>
                <br>
                    {{ data_laporan.address_gym }}<br><br>
                    <b>LAPORAN PENDAPATAN BULANAN</b><br>
                PERIODE  &nbsp;&nbsp;: {{ data_laporan.periode }}<br>
                Tanggal cetak&nbsp;&nbsp;&nbsp;&nbsp;: {{ data_laporan.tanggal_cetak }}<br>
                <table style="border: 1px solid black;">
                    <tr>
                        <th width="165px" style="border: 1px solid black; padding: 5px;">Bulan</th>
                        <th width="165px" style="border: 1px solid black; padding: 5px;">Aktivasi</th>
                        <th width="165px" style="border: 1px solid black; padding: 5px;">Deposit</th>
                        <th width="165px" style="border: 1px solid black; padding: 5px;">Total</th>
                    </tr>

                        <tr v-for="item in data_laporan.data_passing" :key="item.month">
                            <td width="660px" style="border: 1px solid black; padding: 5px;">{{item.month}}</td>
                            <td width="660px" style="border: 1px solid black; padding: 5px;">{{item.aktivasi}}</td>
                            <td width="660px" style="border: 1px solid black; padding: 5px;">{{item.deposit}}</td>
                            <td width="660px" style="border: 1px solid black; padding: 5px;">{{item.total_perbulan}}</td>
                        </tr>

                    <tr>
                        <td colspan="3" style="align-text: right; padding: 5px;">Total</td>
                        <td style="border: 1px solid black; padding: 5px;">{{data_laporan.total}}</td>
                    </tr>
                </table>

                <Bar
                id="my-chart-id"
                :options="chartOptions"
                :data="chartData"
                />

                <!-- <canvas ref="chart"></canvas> -->
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
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
import Chart from 'chart.js'

// import { useRoute } from 'vue2-helpers/vue-router';
export default{
    name: "BarChart",
    components: { Bar },
    data() {
        return {
            search: null,
            dialog: false,
            item: null,
            chartData: {
                labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
                datasets: [{ 
                    // Ini datanya gabisa diupdate
                    data: [], 
                    label: 'Pendapatan Tahunan', 
                    borderWidth: 1, 
                    backgroundColor: 'rgba(100, 162, 235, 1)', 
                }]
            },
            chartOptions: {
                responsive: true
            },
            headers: [
                {
                    text: "ID Laporan Pendapatan Tahunan",
                    align: "start",
                    sortable: true,
                    value: "id_laporan_pendapatan_tahunan",
                    class: "yellow lighten-1"
                },
                { text: "Tahun", value: "tahun", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            headersLaporan: [
                {
                    text: "Bulan",
                    align: "start",
                    sortable: true,
                    value: "month",
                    class: "yellow lighten-1"
                },
                { text: "Aktivasi", value: "aktivasi", class: "yellow lighten-1" },
                { text: "Deposit", value: "deposit", class: "yellow lighten-1" },
                { text: "Total", value: "total_perbulan", class: "yellow lighten-1" },
            ],
            laporan_pendapatan_tahunan: [],
            data_laporan: [],
            data_chart: [],
            chart: null,
        };
    },
    mounted(){
        this.getLaporanPendapatanTahunan();
        this.$nextTick(() => {
            const ctx = this.$refs.chart.getContext('2d');
            this.renderChart(ctx);
        });
    },
    methods: {
        renderChart(ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                labels: ['Label 1', 'Label 2', 'Label 3'],
                datasets: [
                    {
                    label: 'Data',
                    data: [10, 20, 30],
                    backgroundColor: 'rgba(0, 123, 255, 0.5)'
                    }
                ]
                },
                options: {
                responsive: true,
                maintainAspectRatio: false
                }
            });
        },
        closeDialog(){
            this.dialog = false;
        },
        getLaporanPendapatanTahunan(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/laporan_pendapatan_tahunan")
            .then((response) => {
                this.laporan_pendapatan_tahunan = response.data.data;
                console.log(this.laporan_pendapatan_tahunan)
            }).catch((error) => {
                console.log(error)
            });

            axios.get("https://calvin.ppcdeveloper.com/api" + "/laporan_pendapatan_tahunan/2023")
            .then((response) => {
                this.chartData.datasets[0].data = response.data.data.total_perbulan_1;
                this.data_chart = response.data.data.total_perbulan_1;
                console.log(this.chartData.datasets[0].data)
            }).catch((error) => {
                console.log(error)
            });
        },
        getData(item){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/laporan_pendapatan_tahunan/" + item.tahun)
            .then((response) => {
                this.item = item;
                this.data_laporan = response.data.data;
                this.chartData.datasets[0].data = response.data.data.total_perbulan_1;
                console.log(this.chartData.datasets[0].data);

                // this.chart = new ChartJS(this.$refs.barChart.getContext('2d'), {
                //     type: 'bar',
                //     data: response.data.data.total_perbulan_1,
                //     options: {
                //         responsive: true,
                //         maintainAspectRatio: false,
                //     },
                // });

                // this.chart.update();
            }).catch((error) => {
                console.log(error)
            });
            this.dialog = true;
        },
        cancel() {
            this.dialog = false;
        },
    },
};
</script>
<style>
    .text {
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 40px;
        font-style: italic;
    }
</style>