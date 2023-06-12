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
                    <v-list-item-title class="headline">Deposit Class Report Page</v-list-item-title>
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
                    <v-btn small class="mr-2 red lighten-3" @click="checkDepoClass(item)"> Show Deposit </v-btn>
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
                        <v-select
                            v-model="formDepo.id_class_promo"
                            :items="class_promo"
                            item-value="id_class_promo"
                            :item-text="item => `${item.amount_deposit} - ${item.class_details.class_name} - Rp.${item.total_price},-`"
                            label="ID Class Promo"
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

        <v-dialog v-model="dialogShowDeposit" persistent width="auto">
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
            <v-data-table :headers="headersShowDeposit" :items="showDepositClass" :search="search">
            </v-data-table>
            <v-card-actions>
                    <v-btn color="red darken-2" text @click="closeShowDeposit" style="margin-left: 1300px;">Close</v-btn>
                </v-card-actions>
        </v-card>
        </v-dialog>

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
                <v-data-table :headers="headersDepoClass" :items="deposit_class" :search="search">
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
            id_class_promo: null,
            dialogShow: false,
            expired_date: null,
            dialogShowDeposit: null,
            duration: null,
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
            headersDepoClass: [
                {
                    text: "Report Number Deposit Class",
                    align: "start",
                    sortable: true,
                    value: "report_number_class_deposit",
                    class: "yellow lighten-1"
                },
                { text: "ID Member", value: "fullname_member", class: "yellow lighten-1" },
                { text: "ID Pegawai", value: "fullname_pegawai", class: "yellow lighten-1" },
                { text: "Class Name", value: "class_name", class: "yellow lighten-1" },
                { text: "Total Deposit", value: "amount_deposit", class: "yellow lighten-1" },
                { text: "Total Price", value: "total_price", class: "yellow lighten-1" },
                { text: "Expired Date", value: "expired_date", class: "yellow lighten-1" },
                { text: "Datetime", value: "datetime", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },

            ],
            headersShowDeposit: [
                {
                    text: "ID Deposit Class",
                    align: "start",
                    sortable: true,
                    value: "id_deposit_class",
                    class: "yellow lighten-1"
                },
                { text: "ID Member", value: "fullname", class: "yellow lighten-1" },
                { text: "ID Class", value: "class_name", class: "yellow lighten-1" },
                { text: "Total Amount", value: "total_amount", class: "yellow lighten-1" },
                { text: "Expired Date", value: "expired_date", class: "yellow lighten-1" },
            ],
            members: [],
            deposit_class: [],
            showDepositClass: [],
            class_promo: [],
            class_promo_details: [],
            class_details: [],
            formDepo: {
                id_class_promo: null,
            },
            snackbar: {
                show: false,
                color: '',
                icon: '',
                message: '',
            },
        };
    },
    methods: {
        closeShowDeposit(){
            this.dialogShowDeposit = false;
        },
        checkDepoClass(item){
            axios.get("https://calvin.ppcdeveloper.com/api/deposit_classes/" + item.id_member)
            .then((response) => {
                this.showDepositClass = response.data.data;
                this.duration = response.data.data.duration;
                console.log(this.showDepositClass);
            }).catch((error) => {
                console.log(error)
            });
            this.dialogShowDeposit = true;
        },
        getClassPromoDetails(){
            axios.get("https://calvin.ppcdeveloper.com/api/class_promos/" + this.id_class_promo)
            .then((response) => {
                this.class_promo_details = response.data.data;
                console.log("INFOOOOOOOOOOOOOO");
                console.log(this.class_promo_details);
            }).catch((error) => {
                console.log(error)
            });
        },
        getClassPromo(){
            axios.get("https://calvin.ppcdeveloper.com/api/class_promos/")
            .then((response) => {
                this.class_promo = response.data.data;
                console.log(this.class_promo);
            }).catch((error) => {
                console.log(error)
            });
        },
        showReport(item){
            axios.get("https://calvin.ppcdeveloper.com/api/deposit_class_reports/" + item.id_member)
            .then((response) => {
                this.deposit_class = response.data.data;
                console.log(this.deposit_class);
            }).catch((error) => {
                console.log(error)
            });
            this.dialogShow = true;
        },
        closeDialogShow(){
            this.deposit_class = [];
            this.dialogShow = false;
        },
        // confirmDepo(){
        //     let id_pegawai = localStorage.getItem('id');
        //     let id_class_promo = this.formDepo.id_class_promo;
        //     this.id_class_promo = this.formDepo.id_class_promo;
        //     this.getClassPromoDetails();
        //     axios.post("https://calvin.ppcdeveloper.com/api/deposit_class_reports/" + this.id_member, {
        //         id_pegawai: id_pegawai,
        //         id_class_promo: id_class_promo,
        //     }).then((response) => {
        //         console.log(response)
        //         this.formDepo = [];
        //         this.getMembers();
        //     }).catch((error) => {
        //         console.log(error)
        //     });

        //     let expired_date = new Date();
        //     expired_date.setMonth(expired_date.getMonth() + this.duration);
        //     expired_date = expired_date.toJSON().slice(0,10);
        //     axios.put("https://calvin.ppcdeveloper.com/api/deposit_class_reports/" + this.id_member, {
        //         expired_date: expired_date
        //     }).then((response) => {
        //         console.log("Berhasil ubah expired date");
        //     }).catch((error) => {
        //         console.log(error)
        //     });


            
        //     let id_member = this.id_member;
        //     let id_class = this.class_promo_details.id_class;
        //     let total_amount = this.class_promo_details.amount_deposit + this.class_promo_details.bonus;
        //     // let expired_date = new Date().setMonth(new Date().getMonth() + this.class_promo_details.duration);
        //     axios.post("https://calvin.ppcdeveloper.com/api/deposit_classes/" + this.id_member, {
        //         id_member: id_member,
        //         id_class: id_class,
        //         total_amount: total_amount,
        //         expired_date: expired_date
        //     }).then((response) => {
        //         console.log(response)
        //         this.getMembers();
        //     }).catch((error) => {
        //         console.log(error)
        //     });
        //     this.resetForm();
        //     this.dialog = false;
        //     this.dialogDepo = false;
            
        // },
        confirmDepo(){
            let id_pegawai = localStorage.getItem('id');
            let id_class_promo = this.formDepo.id_class_promo;
            this.id_class_promo = this.formDepo.id_class_promo;
            let id_class = this.class_promo_details.id_class;
            this.getClassPromoDetails();
            axios.post("https://calvin.ppcdeveloper.com/api/deposit_class_reports/" + this.id_member, {
                id_pegawai: id_pegawai,
                id_class_promo: id_class_promo,
                id_class: id_class,
            }).then((response) => {
                console.log(response);
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil Deposit Class';
                let id_member = this.id_member;
                let id_class = this.class_promo_details.id_class;
                let total_amount = this.class_promo_details.amount_deposit + this.class_promo_details.bonus;
                let expired_date = new Date();
                expired_date.setMonth(expired_date.getMonth() + this.class_promo_details.duration);
                expired_date = expired_date.toJSON().slice(0,10);
                axios.post("https://calvin.ppcdeveloper.com/api/deposit_classes/" + this.id_member, {
                    id_member: id_member,
                    id_class: id_class,
                    total_amount: total_amount,
                    expired_date: expired_date,
                }).then((response) => {
                    console.log(response)
                    let expired_date = new Date();
                    expired_date.setMonth(expired_date.getMonth() + this.class_promo_details.duration);
                    expired_date = expired_date.toJSON().slice(0,10);
                    axios.put("https://calvin.ppcdeveloper.com/api/deposit_class_reports/" + this.id_member, {
                        expired_date: expired_date,
                    }).then((response) => {
                        console.log("Berhasil ubah expired date");
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error)
                });
                this.getMembers();
                this.resetForm();
                this.dialog = false;
                this.dialogDepo = false;
            }).catch((error) => {
                console.log(error);
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
                this.dialog = false;
                this.dialogDepo = false;
            });
        },
        cancelDepo(){
            this.dialogDepo = false;
        },
        getMembers(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/members", {
            }).then((response) => {
                this.members = response.data.data;
            }).catch((error) => {
                console.log(error)
            });
        },
        addDepo(item){
            // this.expired_date = item.expired_date;
            this.id_member = item.id_member;
            this.dialog = true;
        },
        cetakReport(item){
            axios.get("https://calvin.ppcdeveloper.com/api/deposit_class_reports/printReport/" + item.report_number_class_deposit, {
            }).then((response) => {
                console.log(response);
                console.log('Print report');
            }).catch((error) => {
                console.log(error)
            });
        },
        getDepositClassReport(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/deposit_class_reports")
            .then((response) => {
                this.deposit_class = response.data.data;
                console.log(this.deposit_cash);
            }).catch((error) => {
                console.log(error)
            });
        },
        save() {
            // let amount_deposit = this.formDepo.amount_deposit;
            // axios.post("https://calvin.ppcdeveloper.com/api" + "/deposit_cash_reports", {
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
        this.getClassPromo();
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