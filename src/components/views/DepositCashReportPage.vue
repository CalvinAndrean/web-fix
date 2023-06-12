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
                    <v-list-item-title class="headline">Deposit Cash Report Page</v-list-item-title>
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
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="members" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="addDepo(item)"> Add Deposit </v-btn>                   
                    <v-btn small class="mr-2 red lighten-3" @click="showReport(item)"> Show Report </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <br><br><br>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Deposit</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formDepo.amount_deposit"
                            label="Amount Deposit"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="formDepo.id_cash_promo"
                            :items="cash_promo"
                            item-value="id_cash_promo"
                            :item-text="item => `Topup Rp.${item.min_topup}, - Bonus Rp.${item.bonus},-`"
                            label="ID Cash Promo"
                        ></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDepo" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin menambahkan deposit ini?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmDepo">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelDepo">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogShow" persistent width="auto">
            <v-card>
                <v-data-table :headers="headersDepoCash" :items="deposit_cash" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="cetakReport(item)"> Cetak Report </v-btn>                    
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
            dialogShow: false,
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
            headersDepoCash: [
                {
                    text: "Report Number Deposit Cash",
                    align: "start",
                    sortable: true,
                    value: "report_number_deposit_cash",
                    class: "yellow lighten-1"
                },
                { text: "ID Member", value: "fullname_member", class: "yellow lighten-1" },
                { text: "ID Pegawai", value: "fullname_pegawai", class: "yellow lighten-1" },
                { text: "ID Cash Promo", value: "id_cash_promo", class: "yellow lighten-1" },
                { text: "Date Deposit", value: "date_deposit", class: "yellow lighten-1" },
                { text: "Amount Deposit", value: "amount_deposit", class: "yellow lighten-1" },
                { text: "Bonus Deposit", value: "bonus_deposit", class: "yellow lighten-1" },
                { text: "Remaining Deposit", value: "remaining_deposit", class: "yellow lighten-1" },
                { text: "Total Deposit", value: "total_deposit", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },

            ],
            members: [],
            deposit_cash: [],
            snackbar: {
                show: false,
                color: '',
                icon: '',
                message: '',
            },
            cash_promo: [],
            formDepo: {
                amount_deposit: null,
            },
        };
    },
    methods: {
        getCashPromo(){
            axios.get("http://calvin.ppcdeveloper.com/api/cash_promos/")
            .then((response) => {
                this.cash_promo = response.data.data;
                console.log(this.cash_promo);
            }).catch((error) => {
                console.log(error)
            });
        },
        showReport(item){
            axios.get("http://calvin.ppcdeveloper.com/api/deposit_cash_reports/" + item.id_member)
            .then((response) => {
                this.deposit_cash = response.data.data;
                console.log(this.deposit_cash);
            }).catch((error) => {
                console.log(error)
            });
            this.dialogShow = true;
        },
        closeDialogShow(){
            this.deposit_cash = [];
            this.dialogShow = false;
        },
        confirmDepo(){
            let amount_deposit = this.formDepo.amount_deposit;
            let id_pegawai = localStorage.getItem('id');
            let id_cash_promo = this.formDepo.id_cash_promo;
            axios.post("http://calvin.ppcdeveloper.com/api/deposit_cash_reports/" + this.id_member, {
                amount_deposit: amount_deposit,
                id_pegawai: id_pegawai,
                id_cash_promo: id_cash_promo,
            }).then((response) => {
                console.log(response)
                this.formDepo = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah deposit';
                this.dialogTambah = false;
                //reload
                this.getMembers();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });

            // axios.put("http://calvin.ppcdeveloper.com/api/members/addDepo/" + this.id_member, {
            //     cash_deposit: amount_deposit,
            // }).then((response) => {
            //     console.log(response)
            //     //reset
            //     this.getMembers();
            // }).catch((error) => {
            //     console.log(error)
            // });
            this.resetForm();
            this.dialog = false;
            this.dialogDepo = false;
        },
        cancelDepo(){
            this.dialogDepo = false;
        },
        getMembers(){
            axios.get("http://calvin.ppcdeveloper.com/api" + "/members", {
            }).then((response) => {
                this.members = response.data.data;
            }).catch((error) => {
                console.log(error)
            });
        },
        addDepo(item){
            this.expired_date = item.expired_date;
            this.id_member = item.id_member;
            this.dialog = true;
        },
        cetakReport(item){
            axios.get("http://calvin.ppcdeveloper.com/api/deposit_cash_reports/printReport/" + item.report_number_deposit_cash, {
            }).then((response) => {
                console.log(response);
                console.log('Print report');
            }).catch((error) => {
                console.log(error)
            });
        },
        getDepositCashReport(){
            axios.get("http://calvin.ppcdeveloper.com/api" + "/deposit_cash_reports")
            .then((response) => {
                this.deposit_cash = response.data.data;
                console.log(this.deposit_cash);
            }).catch((error) => {
                console.log(error)
            });
        },
        save() {
            // let amount_deposit = this.formDepo.amount_deposit;
            // axios.post("http://calvin.ppcdeveloper.com/api" + "/deposit_cash_reports", {
            //     amount_deposit: amount_deposit
            // }).then((response) => {
            //     console.log(response)
            //     this.formDepo = [];

            //     // this.snackbar.show = true;
            //     // this.snackbar.color = 'success';
            //     // this.snackbar.icon = 'mdi-check';
            //     // this.snackbar.message = 'Berhasil tambah';
            //     // this.dialogTambah = false;
            //     //reload
            //     this.getDepositCashReport();
            // }).catch((error) => {
            //     console.log(error)
            //     // this.snackbar.show = true;
            //     // this.snackbar.color = 'error';
            //     // this.snackbar.icon = 'mdi-close';
            //     // this.snackbar.message = error.response.data.message;
            // });
            // this.resetForm();
            // this.dialog = false;
            this.dialogDepo = true;
        },
        cancel() {
            this.resetForm();
            this.dialog = false;
        },
        resetForm() {
            this.formDepo = {
                amount_deposit: null,
            };
        },
    },
    mounted(){
        this.getCashPromo();
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