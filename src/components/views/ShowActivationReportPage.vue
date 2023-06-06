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
                    <v-list-item-title class="headline">Show Activation Report Page</v-list-item-title>
                    <v-list-item-subtitle>Show Report</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="activation_reports" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="cetakReport(item)"> Cetak Report </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </v-main>
</template>
<script>
// import { reactive, ref } from "vue";
import axios from "axios";
import { useRoute } from 'vue2-helpers/vue-router';
export default{

    name: "MemberPage",
    data() {
        return {
            search: null,
            dialog: false,
            dialogActivate: false,
            id_member: null,
            expired_date: null,
            headers: [
                {
                    text: "Report Number Activation",
                    align: "start",
                    sortable: true,
                    value: "report_number_activation",
                    class: "yellow lighten-1"
                },
                { text: "ID Member", value: "id_member", class: "yellow lighten-1" },
                { text: "ID Pegawai", value: "id_pegawai", class: "yellow lighten-1" },
                { text: "Datetime", value: "datetime", class: "yellow lighten-1" },
                { text: "Expired Date", value: "expired_date", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },

            ],
            members: [],
            activation_reports: [],
            formActivation: {
                id_member: null,
                id_pegawai: null,
                datetime: null,
                expired_date: null,
            },
        };
    },
    methods: {
        getMembers(){
            axios.get("http://127.0.0.1:8000/api" + "/members", {
            }).then((response) => {
                this.members = response.data.data;
            }).catch((error) => {
                console.log(error)
            });
        },
        cetakReport(item){
            if(item.expired_date != null){
                axios.get("http://127.0.0.1:8000/api/activation_reports/" + item.id_member, {
                }).then((response) => {
                    console.log(response);
                    console.log('Print report');
                }).catch((error) => {
                    console.log(error)
                });
            } else{
                console.log('Member belum teraktivasi');
            }
        },
        getActivationReport(){
            axios.get("http://127.0.0.1:8000/api" + "/activation_reports")
            .then((response) => {
                this.activation_reports = response.data.data;
                console.log(this.activation_reports);
                console.log(this.$router.params.id);
            }).catch((error) => {
                console.log(error)
            });
        },
        cancel() {
            this.resetForm();
            this.dialog = false;
        },
        resetForm() {
            this.formActivation = {
                id_member: null,
                id_pegawai: null,
                datetime: null,
                expired: null
            };
        },
    },
    mounted(){
        this.getActivationReport();
        this.getMembers();
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