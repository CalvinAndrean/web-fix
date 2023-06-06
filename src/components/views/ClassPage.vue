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
                    <v-list-item-title class="headline">Class Page</v-list-item-title>
                    <v-list-item-subtitle>CRUDS Class</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="class_details" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item)"> <span class="mdi mdi-pencil"></span> </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item)"> <span class="mdi mdi-trash-can-outline"></span> </v-btn>                    
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Class</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formClass.class_name"
                            label="Class Name"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formClass.price"
                            label="Price"
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

        <v-dialog v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Edit Instructor</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formClass.class_name"
                            label="Class Name"
                            required
                        ></v-text-field>
                        <v-text-field
                            v-model="formClass.price"
                            label="Price"
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
            id_class_edit: null,
            id_class_delete: null,
            id_class_splice: null,
            search: null,
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            headers: [
                {
                    text: "ID Class",
                    align: "start",
                    sortable: true,
                    value: "id_class",
                    class: "yellow lighten-1"
                },
                { text: "Class Name", value: "class_name", class: "yellow lighten-1" },

                { text: "Price", value: "price", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            class_details: [],
            formClass: {
                class_name: null,
                price: null
            },
            formEdit: {
                class_name: null,
                price: null
            }, 
        };
    },
    methods: {
        getClass(){
            axios.get("http://127.0.0.1:8000/api" + "/class_details")
            .then((response) => {
                this.class_details = response.data.data;
                console.log(this.class_details)
            }).catch((error) => {
                console.log(error)
            });
        },
        save() {
            let class_name = this.formClass.class_name;
            let price = this.formClass.price;
            axios.post("http://127.0.0.1:8000/api" + "/class_details", {
                class_name: class_name,
                price: price,
            }).then((response) => {
                console.log(response)
                //reset
                this.formClass = [];

                // this.snackbar.show = true;
                // this.snackbar.color = 'success';
                // this.snackbar.icon = 'mdi-check';
                // this.snackbar.message = 'Berhasil tambah';
                // this.dialogTambah = false;
                //reload
                this.getClass();
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
        saveEdit(){
            let class_name = this.formEdit.class_name;
            let price = this.formEdit.price;
            axios.put("http://127.0.0.1:8000/api/class_details/" + this.id_class_edit, {
                class_name: class_name,
                price: price,
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
                this.getClass();
            }).catch((error) => {
                console.log(error)
                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialogEdit = false;
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
            this.formClass = {
                class_name: null,
                price: null,
            };
        },
        editItem(item){
            this.edit = this.class_details.indexOf(item);
            this.id_class_edit = this.class_details[this.edit].id_class;
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
            this.id_class_splice = this.class.indexOf(item)
            this.id_class_splice = this.class[this.delete].id_class
            this.dialogDelete = true
        },

        cancelDelete(){
            this.dialogDelete = false
            this.$nextTick(() => { this.delete = -1 })
        },

        confirmDelete(){
            this.class.splice(this.id_class_splice, 1)
            axios.delete("http://127.0.0.1:8000/api/class_details/" + this.id_class_delete)
            this.cancelDelete()
        },
    },
    mounted(){
        this.getClass();

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