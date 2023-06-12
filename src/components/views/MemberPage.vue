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
                    <v-list-item-title class="headline">Member Page</v-list-item-title>
                    <v-list-item-subtitle>CRUDS Member</v-list-item-subtitle>
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
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item)"> <span class="mdi mdi-pencil"></span> </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item)"> <span class="mdi mdi-trash-can-outline"></span> </v-btn>                    
                    <v-btn small class="mr-2 red lighten-3" @click="resetPassword(item)"> Reset Password </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="makeMemberCard(item)"> Member Card </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Member</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formMember.email"
                            label="Email"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formMember.password"
                            label="Password"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formMember.fullname"
                            label="Fullname"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formMember.address"
                            label="Address"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formMember.phone_number"
                            label="Phone Number"
                            required
                        ></v-text-field>
                        <!-- <v-date-picker
                            v-model="formMember.birth_date"
                            label="Birth Date"
                            required
                        ></v-date-picker> -->
                        <v-dialog
                            ref="dialogDatePicker"
                            v-model="modal"
                            :return-value.sync="date"
                            persistent
                            width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="formMember.birth_date"
                                label="Birth Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="formMember.birth_date"
                            scrollable
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="modal = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.dialogDatePicker.save(formMember.birth_date)"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Edit Member</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formEdit.email"
                            label="Email"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formEdit.password"
                            label="Password"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formEdit.fullname"
                            label="Fullname"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formEdit.address"
                            label="Address"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formEdit.phone_number"
                            label="Phone Number"
                            required
                        ></v-text-field>
                        <v-dialog
                            ref="dialogDatePicker"
                            v-model="modal"
                            :return-value.sync="date"
                            persistent
                            width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="formEdit.birth_date"
                                label="Birth Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="formEdit.birth_date"
                                scrollable
                                :allowed-dates="allowedDates"
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="modal = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.dialogDatePicker.save(formEdit.birth_date)"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-text-field
                            v-model="formEdit.cash_deposit"
                            label="Cash Deposit"
                            required
                        ></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelEdit"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogChange" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin reset password data ini?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmChange">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelChange">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin menghapus data ini?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmDelete">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelDelete">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogSaveEdit" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin mengedit data?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmSaveEdit">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelSaveEdit">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogSaveAdd" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin menambah data?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmSaveAdd">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelSaveAdd">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogMemberCard" persistent max-width="480px">
            <v-card
                variant="outlined"
            >
                <v-card-title>GoFit</v-card-title>
                <v-card-text style="margin-top: -10px;">Jl. Centralpark No.10 Yogyakarta</v-card-text>
                <v-card-text>
                    <b>MEMBER CARD</b>
                    <br>
                    <v-text>Member ID       : {{ memberCard.id_member }}</v-text>
                    <br>
                    <v-text>Nama            : {{ memberCard.fullname }}</v-text>
                    <br>
                    <v-text>Alamat          : {{ memberCard.address }}</v-text>
                    <br>
                    <v-text>Telpon          : {{ memberCard.phone_number }}</v-text>
                </v-card-text>

                <v-card-actions>
                <v-btn variant="outlined" text @click="cancelMemberCard" color="red">
                    Cancel
                </v-btn>
                <v-btn variant="outlined" text @click="printMemberCard">
                    Print
                </v-btn>
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
            date: '',
            id_member_edit: null,
            id_member_delete: null,
            id_member_splice: null,
            id_member_change: null,
            id_member_card: null,
            modal: false,
            search: null,
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            dialogChange: false,
            dialogMemberCard: false,
            dialogSaveEdit: false,
            dialogDatePicker: null,
            dialogSaveAdd: false,
            headers: [
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
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            members: [],
            // memberCard: [],
            snackbar: {
                show: false,
                color: '',
                icon: '',
                message: '',
            },
            memberCard: {
                id_member:null,
                email: null,
                password: null,
                birth_date: null,
                fullname: null,
                address: null,
                phone_number: null,
                cash_deposit: null,
            },
            formMember: {
                email: null,
                password: null,
                birth_date: null,
                fullname: null,
                address: null,
                phone_number: null,
                cash_deposit: null,
            },
            formEdit: {
                id_member: null,
                email: null,
                password: null,
                birth_date: null,
                fullname: null,
                
                cash_deposit: null,
            }, 
        };
    },
    methods: {
        nowDate(){
            console.log(Date(date).valueOf() <= Date.now());
            return new Date(date).valueOf() <= Date.now();
        },
        confirmSaveAdd(){
            let email = this.formMember.email;
            let password = this.formMember.password;
            let birth_date = this.formMember.birth_date;
            let fullname = this.formMember.fullname;
            let address = this.formMember.address;
            let phone_number = this.formMember.phone_number;
            axios.post("https://calvin.ppcdeveloper.com/api" + "/members", {
                email: email,
                password: password,
                birth_date: birth_date,
                fullname: fullname,
                address: address,
                phone_number: phone_number,
            }).then((response) => {
                console.log(response)
                //reset
                this.formMember = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah';
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
            this.resetForm();
            this.dialog = false;
            this.dialogSaveAdd = false;
        },
        cancelSaveAdd(){
            this.dialogSaveAdd = false;
        },
        allowedDates(date) {
            // Can not select days before today and today
            return new Date(date).valueOf() > Date.now();
        },
        makeMemberCard(item){
            this.id_member_card = item.id_member;
            axios.get("https://calvin.ppcdeveloper.com/api/members/" + item.id_member, {
            }).then((response) => {
                this.memberCard.id_member = response.data.data.id_member;
                this.memberCard.email = response.data.data.email;
                this.memberCard.password = response.data.data.password;
                this.memberCard.birth_date = response.data.data.birth_date;
                this.memberCard.fullname = response.data.data.fullname;
                this.memberCard.address = response.data.data.address;
                this.memberCard.phone_number = response.data.data.phone_number;
                console.log(response)
            }).catch((error) => {
                console.log(error)
            });

            this.dialogMemberCard = true;
        },
        cancelSaveEdit(){
            this.dialogSaveEdit = false
            this.$nextTick(() => { this.edit = -1 })
        },

        confirmSaveEdit(){
            let email = this.formEdit.email;
            let password = this.formEdit.password;
            let birth_date = this.formEdit.birth_date;
            let fullname = this.formEdit.fullname;
            let address = this.formEdit.address;
            let phone_number = this.formEdit.phone_number;
            axios.put("https://calvin.ppcdeveloper.com/api/members/" + this.id_member_edit, {
                email: email,
                password: password,
                birth_date: birth_date,
                fullname: fullname,
                address: address,
                phone_number: phone_number,
            }).then((response) => {
                console.log(response)
                //reset
                this.formEdit = [];

                // this.snackbar.show = true;
                // this.snackbar.color = 'success';
                // this.snackbar.icon = 'mdi-check';
                // this.snackbar.message = 'Berhasil tambah';
                // this.dialogTambah = false;
                //reload
                this.getMembers();
            }).catch((error) => {
                console.log(error)
                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialogSaveEdit = false;
            this.dialogEdit = false;
        },
        cancelMemberCard(){
            this.dialogMemberCard = false;
        },
        printMemberCard(){
            axios.get("https://calvin.ppcdeveloper.com/api/members/membercard/" + this.id_member_card, {
            }).then((response) => {
                console.log(response);
                console.log('Print membercard');
            }).catch((error) => {
                console.log(error)
            });
        },
        resetPassword(item){
            this.change = this.members.indexOf(item);
            this.id_member_change = this.members[this.change].id_member
            this.dialogChange = true
            axios.put("https://calvin.ppcdeveloper.com/api/members/resetPassword/" + this.id_member_change, {
            }).then((response) => {
                console.log(response)
                this.getMembers();
            }).catch((error) => {
                console.log(error)
            });
            // this.resetForm();
            // this.dialogEdit = false;
        },
        cancelChange(){
            this.dialogChange = false
            this.$nextTick(() => { this.change = -1 })
        },

        confirmChange(){
            axios.put("https://calvin.ppcdeveloper.com/api/members/resetPassword/" + this.id_member_change, {
            }).then((response) => {
                console.log(response)
                this.getMembers();
            }).catch((error) => {
                console.log(error)
            });
            this.cancelChange()
        },
        getMembers(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/members")
            .then((response) => {
                this.members = response.data.data;
                console.log(this.members)
            }).catch((error) => {
                console.log(error)
            });
        },
        save() {
            this.dialogSaveAdd = true;
        },
        saveEdit(){
            this.dialogSaveEdit = true;
            // this.dialogEdit = false;
        },
        cancel() {
            this.resetForm();
            this.dialog = false;
        },
        cancelEdit(){
            this.resetForm();
            this.dialogEdit = false;
        },
        resetForm() {
            this.formMember = {
                id_member: null,
                email: null,
                password: null,
                birth_date: null,
                fullname: null,
                address: null,
                phone_number: null,
                cash_deposit: null,
                expired_date: null,
            };
        },
        editItem(item){
            this.edit = this.members.indexOf(item);
            this.id_member_edit = this.members[this.edit].id_member;
            // this.formMember.email = item.email;
            // this.formMember.password = item.password;
            // this.formMember.birth_date = item.birth_date;
            // this.formMember.fullname = item.fullname;
            // this.formMember.cash_deposit = item.cash_deposit;
            this.formEdit = item;
            this.dialogEdit = true;
        },
        deleteItem(item){
            this.delete = this.members.indexOf(item)
            this.id_member_splice = this.members.indexOf(item)
            this.id_member_delete = this.members[this.delete].id_member
            this.dialogDelete = true
        },

        cancelDelete(){
            this.dialogDelete = false
            this.$nextTick(() => { this.delete = -1 })
        },

        confirmDelete(){
            this.members.splice(this.id_member_splice, 1)
            axios.delete("https://calvin.ppcdeveloper.com/api/members/" + this.id_member_delete)
            this.cancelDelete()
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