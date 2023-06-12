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
                    <v-list-item-title class="headline">Special Feature Page</v-list-item-title>
                    <v-list-item-subtitle>System Functional</v-list-item-subtitle>
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
                <!-- <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn> -->
            </v-card-title>
        </v-card>
        <v-card>
            <br><br><br>
            <v-btn color="success" dark @click="dialogDeactivate = true" style="float: right; margin-top: -55px; margin-right: 20px;"> Deactivate </v-btn>
            <v-data-table :headers="headersDeactivate" :items="members" :search="search">
            </v-data-table>
        </v-card>

        <v-card>
            <br><br><br>
            <v-btn color="success" dark @click="dialogResetDepositClass = true" style="float: right; margin-top: -55px; margin-right: 20px;"> Reset Deposit Class </v-btn>
            <v-data-table :headers="headersReset" :items="deposit_classes" :search="search">
            </v-data-table>
        </v-card>

        <br>
        <v-btn color="success" dark @click="dialogResetTotalLate = true" style="float: right; margin-right: 20px;"> Reset Total Late Instructor </v-btn>

        <v-dialog v-model="dialogDeactivate" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin deactivate seluruh member yang expired?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmDeactivate">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelDeactivate">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogResetTotalLate" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin reset total late instructor?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmResetLate">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelResetLate">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogResetDepositClass" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin reset deposit class yang expired?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmReset">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelReset">Tidak</v-btn>
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
            modal: false,
            search: null,
            dialog: false,
            dialogDeactivate: false,
            dialogResetDepositClass: false,
            dialogResetTotalLate: false,
            id_member: '1',
            id_deposit_class: 1,
            headersDeactivate: [
                {
                    text: "ID Member",
                    align: "start",
                    sortable: true,
                    value: "id_member",
                    class: "yellow lighten-1"
                },
                { text: "Email", value: "email", class: "yellow lighten-1" },

                { text: "Birth Date", value: "birth_date", class: "yellow lighten-1" },
                { text: "Fullname", value: "fullname", class: "yellow lighten-1" },
                { text: "Address", value: "address", class: "yellow lighten-1" },
                { text: "Phone Number", value: "phone_number", class: "yellow lighten-1" },
                { text: "Cash Deposit", value: "cash_deposit", class: "yellow lighten-1" },
                { text: "Expired Date", value: "expired_date", class: "yellow lighten-1" },
            ],

            headersReset: [
                {
                    text: "ID Deposit Class",
                    align: "start",
                    sortable: true,
                    value: "id_deposit_class",
                    class: "yellow lighten-1"
                },
                { text: "ID Member", value: "id_member", class: "yellow lighten-1" },
                { text: "ID Class", value: "id_class", class: "yellow lighten-1" },
                { text: "Total Amount", value: "total_amount", class: "yellow lighten-1" },
                { text: "Expired Date", value: "expired_date", class: "yellow lighten-1" },
            ],
            members: [],
            deposit_classes: [],
            snackbar: {
                show: false,
                color: '',
                icon: '',
                message: '',
            },
        };
    },
    methods: {
        confirmResetLate(){
            axios.put("https://calvin.ppcdeveloper.com/api/instructors/resetTotalLate/1", {
            }).then((response) => {
                console.log(response)
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil reset total late seluruh instructor';
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            this.dialogResetTotalLate = false;
        },
        cancelResetLate(){
            this.dialogResetTotalLate = false;
        },
        cancelDeactivate(){
            this.dialogDeactivate = false;
        },

        confirmDeactivate(){
            axios.put("https://calvin.ppcdeveloper.com/api/members/deactivated/" + this.id_member, {
            }).then((response) => {
                console.log(response);
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil deactivate seluruh member expired';
                this.getMembers();
            }).catch((error) => {
                console.log(error);
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            this.dialogDeactivate = false;
        },
        getMembers(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/members/showExpired/" + this.id_member)
            .then((response) => {
                this.members = response.data.data;
                console.log(this.members)
            }).catch((error) => {
                console.log(error);
            });
        },
        getDepositClass(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/deposit_classes/showExpired/" + this.id_deposit_class)
            .then((response) => {
                this.deposit_classes = response.data.data;
                console.log(this.members)
            }).catch((error) => {
                console.log(error);
            });
        },
        cancelReset(){
            this.dialogResetDepositClass = false
            this.$nextTick(() => { this.delete = -1 })
        },
        confirmReset(){
            axios.put("https://calvin.ppcdeveloper.com/api" + "/deposit_classes/resetDepositClass/" + this.id_deposit_class)
            .then((response) => {
                console.log(response);
                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil reset deposit class yang expired';
                this.getDepositClass();
            }).catch((error) => {
                console.log(error);
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            this.dialogResetDepositClass = false;
        },
    },
    mounted(){
        this.getMembers();
        this.getDepositClass();

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