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
                    <v-list-item-title class="headline">Pegawai Page</v-list-item-title>
                    <v-list-item-subtitle>CRUDS Pegawai</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="pegawais" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item)"> <span class="mdi mdi-pencil"></span> </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item)"> <span class="mdi mdi-trash-can-outline"></span> </v-btn>                    
                    <v-btn small class="mr-2 red lighten-3" @click="updatePassword(item)"> Update Password </v-btn>                    
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Pegawai</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formPegawai.email"
                            label="Email"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formPegawai.password"
                            label="Password"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formPegawai.fullname"
                            label="Fullname"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formPegawai.address"
                            label="Address"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formPegawai.phone_number"
                            label="Phone Number"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="formPegawai.role"
                            label="Role"
                            :items="['MO', 'Admin', 'Kasir']"
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

        <v-dialog v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Edit Pegawai</span>
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
                            label="Phone Number "
                            required
                        ></v-text-field>
                        <v-select
                            v-model="formEdit.role"
                            label="Role"
                            :items="['MO', 'Admin', 'Kasir']"
                        ></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelEdit"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogUpdate" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Update Password Pegawai</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formEditPassword.password"
                            label="Password"
                            required
                        ></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelUpdate"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveUpdate"> Save</v-btn>
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

        <v-dialog v-model="dialogSaveUpdate" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin mengubah password?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmSaveUpdate">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelSaveUpdate">Tidak</v-btn>
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
            id_pegawai_edit: null,
            id_pegawai_delete: null,
            id_pegawai_splice: null,
            id_pegawai_change: null,
            search: null,
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            dialogUpdate: false,
            dialogSaveEdit: false,
            dialogSaveUpdate: false,
            dialogSaveAdd: false,
            headers: [
                {
                    text: "ID Pegawai",
                    align: "start",
                    sortable: true,
                    value: "id_pegawai",
                    class: "yellow lighten-1"
                },
                { text: "Email", value: "email", class: "yellow lighten-1" },

                { text: "Fullname", value: "fullname", class: "yellow lighten-1" },
                { text: "Address", value: "address", class: "yellow lighten-1" },
                { text: "Phone Number", value: "phone_number", class: "yellow lighten-1" },
                { text: "Role", value: "role", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            pegawais: [],
            formPegawai: {
                email: null,
                password: null,
                address: null,
                fullname: null,
                phone_number: null,
                role: null
            },
            formEdit: {
                email: null,
                password: null,
                address: null,
                fullname: null,
                phone_number: null,
                role: null
            }, 
            formEditPassword: {
                password: null
            },
        };
    },
    methods: {
        confirmSaveAdd(){
            let email = this.formPegawai.email;
            let password = this.formPegawai.password;
            let address = this.formPegawai.address;
            let fullname = this.formPegawai.fullname;
            let phone_number = this.formPegawai.phone_number;
            let role = this.formPegawai.role;
            axios.post("https://calvin.ppcdeveloper.com/api" + "/pegawais", {
                email: email,
                password: password,
                address: address,
                fullname: fullname,
                phone_number: phone_number,
                role: role
            }).then((response) => {
                console.log(response)
                //reset
                this.formPegawai = [];

                // this.snackbar.show = true;
                // this.snackbar.color = 'success';
                // this.snackbar.icon = 'mdi-check';
                // this.snackbar.message = 'Berhasil tambah';
                // this.dialogTambah = false;
                //reload
                this.getPegawais();
            }).catch((error) => {
                console.log(error)
                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialog = false;
            this.dialogSaveAdd = false;
        },
        cancelSaveAdd(){
            this.dialogSaveAdd = false;
        },
        confirmSaveUpdate(){
            let password = this.formEditPassword.password;
            axios.put("https://calvin.ppcdeveloper.com/api/pegawais/updatePassword/" + this.id_pegawai_change, {
                password: password,
            }).then((response) => {
                console.log(response)
                //reset
                this.formEditPassword = [];

                // this.snackbar.show = true;
                // this.snackbar.color = 'success';
                // this.snackbar.icon = 'mdi-check';
                // this.snackbar.message = 'Berhasil tambah';
                // this.dialogTambah = false;
                //reload
                this.getPegawais();
            }).catch((error) => {
                console.log(error)
                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialogUpdate = false;
            this.dialogSaveUpdate = false;
        },
        cancelSaveUpdate(){
            this.dialogSaveUpdate = false;
            this.$nextTick(() => { this.edit = -1 });
        },
        cancelSaveEdit(){
            this.dialogSaveEdit = false;
            this.$nextTick(() => { this.edit = -1 });
        },

        confirmSaveEdit(){
            let email = this.formEdit.email;
            let password = this.formEdit.password;
            let address = this.formEdit.address;
            let fullname = this.formEdit.fullname;
            let phone_number = this.formEdit.phone_number;
            let role = this.formEdit.role;
            axios.put("https://calvin.ppcdeveloper.com/api/pegawais/" + this.id_pegawai_edit, {
                email: email,
                password: password,
                address: address,
                fullname: fullname,
                phone_number: phone_number,
                role: role
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
                this.getPegawais();
            }).catch((error) => {
                console.log(error)
                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialogEdit = false;
            this.dialogSaveEdit = false;
        },
        updatePassword(item){
            this.changePassword = this.pegawais.indexOf(item);
            this.id_pegawai_change = this.pegawais[this.changePassword].id_pegawai;
            // this.formMember.email = item.email;
            // this.formMember.password = item.password;
            // this.formMember.birth_date = item.birth_date;
            // this.formMember.fullname = item.fullname;
            // this.formMember.cash_deposit = item.cash_deposit;
            // this.formEditPassword = item;
            this.dialogUpdate = true;
        },
        saveUpdate(){
            this.dialogSaveUpdate = true;
        },
        cancelUpdate(){
            this.resetForm();
            this.dialogUpdate = false;
        },
        getPegawais(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/pegawais")
            .then((response) => {
                this.pegawais = response.data.data;
                console.log(this.pegawais)
            }).catch((error) => {
                console.log(error)
            });
        },
        save() {
            this.dialogSaveAdd = true;
        },
        saveEdit(){
            this.dialogSaveEdit = true;
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
            this.formPegawai = {
                email: null,
                password: null,
                address: null,
                fullname: null,
                phone_number: null,
                role: null
            };
        },
        editItem(item){
            this.edit = this.pegawais.indexOf(item);
            this.id_pegawai_edit = this.pegawais[this.edit].id_pegawai;
            // this.formMember.email = item.email;
            // this.formMember.password = item.password;
            // this.formMember.birth_date = item.birth_date;
            // this.formMember.fullname = item.fullname;
            // this.formMember.cash_deposit = item.cash_deposit;
            this.formEdit = item;
            this.dialogEdit = true;
        },
        deleteItem(item){
            this.delete = this.pegawais.indexOf(item)
            this.id_pegawai_splice = this.pegawais.indexOf(item)
            this.id_pegawai_delete = this.pegawais[this.delete].id_pegawai
            this.dialogDelete = true
        },

        cancelDelete(){
            this.dialogDelete = false
            this.$nextTick(() => { this.delete = -1 })
        },

        confirmDelete(){
            this.pegawais.splice(this.id_pegawai_splice, 1)
            axios.delete("https://calvin.ppcdeveloper.com/api/pegawais/" + this.id_pegawai_delete)
            this.cancelDelete()
        },
    },
    mounted(){
        this.getPegawais();

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