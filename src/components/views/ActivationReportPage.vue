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
                    <v-list-item-title class="headline">Activation Report Page</v-list-item-title>
                    <v-list-item-subtitle>Print Report</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="members" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="activate(item)"> Activate </v-btn> 
                    <!-- <v-btn small class="mr-2 red lighten-3" @click="cetakReport(item)"> Cetak Report </v-btn> -->
                    <v-btn small class="mr-2 red lighten-3" @click="showReport(item)"> Show Report </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <br><br>
        <!-- <v-card>
            <v-data-table :headers="headersActivation" :items="activation_reports" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="activate(item)"> Activate </v-btn> 
                    <v-btn small class="mr-2 red lighten-3" @click="cetakReport(item)"> Cetak Report </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="showReport(item)"> Show Report </v-btn>
                </template>
            </v-data-table>
        </v-card> -->

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Form Activation</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formActivation.id_pegawai"
                            label="ID Pegawai"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formActivation.datetime"
                            label="Date"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formActivation.expired_date"
                            label="Date"
                            required
                        ></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogActivate" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin mengaktifkan member ini?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmActivate">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelActivate">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogShow" persistent width="auto">
            <v-card>
            <v-data-table :headers="headersActivation" :items="activation_reports" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <!-- <v-btn small class="mr-2 red lighten-3" @click="activate(item)"> Activate </v-btn>  -->
                    <v-btn small class="mr-2 red lighten-3" @click="cetakReport(item)"> Cetak Report </v-btn>
                    <!-- <v-btn small class="mr-2 red lighten-3" @click="showReport(item)"> Show Report </v-btn> -->
                </template>
            </v-data-table>
            <v-card-actions>
                    <v-btn color="red darken-2" text @click="closeDialogShow" style="margin-left: 1200px;">Close</v-btn>
                </v-card-actions>
        </v-card>
        </v-dialog>
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
            dialogActivate: false,
            dialogShow: false,
            id_member: null,
            expired_date: null,
            headers: [
                {
                    text: "ID Member",
                    align: "start",
                    sortable: true,
                    value: "id_member",
                    class: "yellow lighten-1"
                },
                { text: "Fullname", value: "fullname", class: "yellow lighten-1" },
                { text: "Cash Deposit", value: "cash_deposit", class: "yellow lighten-1" },
                { text: "Expired Date", value: "expired_date", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },

            ],
            headersActivation: [
                {
                    text: "Report Number Activation",
                    align: "start",
                    sortable: true,
                    value: "report_number_activation",
                    class: "yellow lighten-1"
                },
                { text: "ID Member", value: "id_member", class: "yellow lighten-1" },
                { text: "Fullname Member", value: "fullname_member", class: "yellow lighten-1" },
                { text: "ID Pegawai", value: "id_pegawai", class: "yellow lighten-1" },
                { text: "Fullname Pegawai", value: "fullname_pegawai", class: "yellow lighten-1" },
                { text: "Datetime", value: "datetime", class: "yellow lighten-1" },
                { text: "Cash Deposit", value: "cash_deposit", class: "yellow lighten-1" },
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
        closeDialogShow(){
            this.activation_reports = [];
            this.dialogShow = false;
        },
        showReport(item){
            // this.$router.push({ path: '/show_activation_report', params: { id: item.id_member}});
            axios.get("http://calvin.ppcdeveloper.com/api/activation_reports/" + item.id_member)
            .then((response) => {
                this.activation_reports = response.data.data;
                console.log(this.activation_reports);
            }).catch((error) => {
                console.log(error)
            });
            this.dialogShow = true;
        },
        confirmActivate(){
            if(this.expired_date >= new Date().toJSON().slice(0,10)){
                console.log('Sudah memiliki report aktivasi');
                this.dialogActivate = false;
            } else{
                let id_pegawai = localStorage.getItem('id');
                let date = new Date();
                let datetime = date.toJSON().slice(0,16).replace(/T/g,' ');
                let expired_date = date;
                expired_date.setFullYear(expired_date.getFullYear() + 1);
                expired_date = expired_date.toJSON().slice(0,10);
                axios.post("http://calvin.ppcdeveloper.com/api/activation_reports/" + this.id_member, {
                    id_member: this.id_member,
                    id_pegawai: id_pegawai,
                    datetime: datetime,
                    expired_date: expired_date
                }).then((response) => {
                    console.log(response)
                    this.formActivation = [];

                    // this.snackbar.show = true;
                    // this.snackbar.color = 'success';
                    // this.snackbar.icon = 'mdi-check';
                    // this.snackbar.message = 'Berhasil tambah';
                    // this.dialogTambah = false;
                    //reload
                    this.getActivationReport();
                }).catch((error) => {
                    console.log(error)
                    // this.snackbar.show = true;
                    // this.snackbar.color = 'error';
                    // this.snackbar.icon = 'mdi-close';
                    // this.snackbar.message = error.response.data.message;
                });

                axios.put("http://calvin.ppcdeveloper.com/api/members/changeExpired/" + this.id_member, {
                    expired_date: expired_date,
                }).then((response) => {
                    console.log(response)
                    //reset
                    this.getMembers();
                }).catch((error) => {
                    console.log(error)
                });
                this.resetForm();
                this.dialog = false;
                this.dialogActivate = false;
            }
        },
        cancelActivate(){
            this.dialogActivate = false;
        },
        getMembers(){
            axios.get("http://calvin.ppcdeveloper.com/api" + "/members", {
            }).then((response) => {
                this.members = response.data.data;
                if(this.members.expired_date >= new Date().toJSON().slice(0,10)){
                    this.isExpired = false;
                } else{
                    this.isExpired = true;
                }
            }).catch((error) => {
                console.log(error)
            });
        },
        activate(item){
            this.expired_date = item.expired_date;
            this.id_member = item.id_member;
            this.dialogActivate = true;
        },
        cetakReport(item){
            if(item.expired_date != null){
                axios.get("http://calvin.ppcdeveloper.com/api/activation_reports/printReport/" + item.id_member, {
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
            axios.get("http://calvin.ppcdeveloper.com/api" + "/activation_reports")
            .then((response) => {
                this.activation_reports = response.data.data;
                console.log(this.activation_reports);
            }).catch((error) => {
                console.log(error)
            });
        },
        save() {
            let id_member = this.formActivation.id_member;
            let id_pegawai = this.formActivation.id_pegawai;
            let datetime = this.formActivation.datetime;
            let expired_date = this.formActivation.expired_date;
            axios.post("http://calvin.ppcdeveloper.com/api" + "/activation_reports", {
                id_member: id_member,
                id_pegawai: id_pegawai,
                datetime: datetime,
                expired_date: expired_date
            }).then((response) => {
                console.log(response)
                this.formActivation = [];

                // this.snackbar.show = true;
                // this.snackbar.color = 'success';
                // this.snackbar.icon = 'mdi-check';
                // this.snackbar.message = 'Berhasil tambah';
                // this.dialogTambah = false;
                //reload
                this.getActivationReport();
            }).catch((error) => {
                console.log(error)
                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialog = false;
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