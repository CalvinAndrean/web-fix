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
                    <v-list-item-title class="headline">Instructor Page</v-list-item-title>
                    <v-list-item-subtitle>CRUDS Instructor</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="instructors" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item)"> <span class="mdi mdi-pencil"></span> </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item)"> <span class="mdi mdi-trash-can-outline"></span> </v-btn>                    
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Instructor</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formInstructor.email"
                            label="Email"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formInstructor.password"
                            label="Password"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formInstructor.address"
                            label="Address"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formInstructor.fullname"
                            label="Fullname"
                            required
                        ></v-text-field>
                        <v-date-picker
                            v-model="formInstructor.birth_date"
                            label="Birth Date"
                            required
                        ></v-date-picker>
                        <v-text-field
                            v-model="formInstructor.phone_number"
                            label="Phone Number"
                            required
                        ></v-text-field>
                        <!-- ROLE v-select -->
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
                    <span class="headine"> Edit Instructor</span>
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
                        <v-date-picker
                            v-model="formEdit.birth_date"
                            label="Birth Date"
                            required
                        ></v-date-picker>
                        <v-text-field
                            v-model="formEdit.phone_number"
                            label="Phone Number"
                            required
                        ></v-text-field>
                        <!-- ROLE v-select -->
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelEdit"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit"> Save</v-btn>
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
            id_instructor_edit: null,
            id_instructor_delete: null,
            id_instructor_splice: null,
            search: null,
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            dialogSaveEdit: false,
            dialogSaveAdd: false,
            headers: [
                {
                    text: "ID Instructor",
                    align: "start",
                    sortable: true,
                    value: "id_instructor",
                    class: "yellow lighten-1"
                },
                { text: "Email", value: "email", class: "yellow lighten-1" },

                { text: "Fullname", value: "fullname", class: "yellow lighten-1" },
                { text: "Birth Date", value: "birth_date", class: "yellow lighten-1" },
                { text: "Address", value: "address", class: "yellow lighten-1" },
                { text: "Phone Number", value: "phone_number", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            instructors: [],
            snackbar: {
                show: false,
                color: '',
                icon: '',
                message: '',
            },
            formInstructor: {
                email: null,
                password: null,
                address: null,
                fullname: null,
                phone_number: null,
                birth_date: null
            },
            formEdit: {
                email: null,
                password: null,
                address: null,
                fullname: null,
                phone_number: null,
                birth_date: null
            }, 
        };
    },
    methods: {
        confirmSaveAdd(){
            let email = this.formInstructor.email;
            let password = this.formInstructor.password;
            let address = this.formInstructor.address;
            let fullname = this.formInstructor.fullname;
            let phone_number = this.formInstructor.phone_number;
            let birth_date = this.formInstructor.birth_date;
            axios.post("https://calvin.ppcdeveloper.com/api" + "/instructors", {
                email: email,
                password: password,
                address: address,
                fullname: fullname,
                phone_number: phone_number,
                birth_date: birth_date
            }).then((response) => {
                console.log(response)
                //reset
                this.formInstructor = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil tambah Instructor';
                // this.dialogTambah = false;
                //reload
                this.getInstructors();
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
        getInstructors(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/instructors")
            .then((response) => {
                this.instructors = response.data.data;
                console.log(this.instructors)
            }).catch((error) => {
                console.log(error)
            });
        },
        cancelSaveEdit(){
            this.dialogSaveEdit = false
            this.$nextTick(() => { this.edit = -1 })
        },

        confirmSaveEdit(){
            let email = this.formEdit.email;
            let password = this.formEdit.password;
            let address = this.formEdit.address;
            let fullname = this.formEdit.fullname;
            let phone_number = this.formEdit.phone_number;
            let birth_date = this.formEdit.birth_date;
            axios.put("https://calvin.ppcdeveloper.com/api/instructors/" + this.id_instructor_edit, {
                email: email,
                password: password,
                address: address,
                fullname: fullname,
                phone_number: phone_number,
                birth_date: birth_date
            }).then((response) => {
                console.log(response)
                //reset
                this.formEdit = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil edit Instructor';
                // this.dialogTambah = false;
                //reload
                this.getInstructors();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialogSaveEdit = false;
            this.dialogEdit = false;
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
            this.formInstructor = {
                email: null,
                password: null,
                address: null,
                fullname: null,
                phone_number: null,
                birth_date: null
            };
        },
        editItem(item){
            this.edit = this.instructors.indexOf(item);
            this.id_instructor_edit = this.instructors[this.edit].id_instructor;
            // this.formMember.email = item.email;
            // this.formMember.password = item.password;
            // this.formMember.birth_date = item.birth_date;
            // this.formMember.fullname = item.fullname;
            // this.formMember.cash_deposit = item.cash_deposit;
            this.formEdit = item;
            this.dialogEdit = true;
        },
        deleteItem(item){
            this.delete = this.instructors.indexOf(item)
            this.id_instructor_splice = this.instructors.indexOf(item)
            this.id_instructor_delete = this.instructors[this.delete].id_instructor
            this.dialogDelete = true
        },

        cancelDelete(){
            this.dialogDelete = false
            this.$nextTick(() => { this.delete = -1 })
        },

        confirmDelete(){
            this.instructors.splice(this.id_instructor_splice, 1)
            axios.delete("https://calvin.ppcdeveloper.com/api/instructors/" + this.id_instructor_delete)
            this.snackbar.show = true;
            this.snackbar.color = 'success';
            this.snackbar.icon = 'mdi-check';
            this.snackbar.message = 'Berhasil deactivate Instructor';
            this.cancelDelete()
        },
    },
    mounted(){
        this.getInstructors();

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