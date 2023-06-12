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
                    <v-list-item-title class="headline">Class Daily Page</v-list-item-title>
                    <v-list-item-subtitle>Generate Class Daily</v-list-item-subtitle>
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
                <v-btn color="success" dark @click=generate()> Generate </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="class_daily" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item)"> <span class="mdi mdi-pencil"></span> </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item)"> <span class="mdi mdi-trash-can-outline"></span> </v-btn>                    
                </template>
            </v-data-table>
        </v-card>

        <!-- <v-dialog v-model="dialog" persistent max-width="600px">
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
        </v-dialog> -->

        <v-dialog v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Edit Instructor</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="formEdit.status"
                            label="Status"
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
            id_class_daily_edit: null,
            id_class_daily_delete: null,
            id_class_daily_splice: null,
            search: null,
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            dialogSaveEdit: false,
            headers: [
                {
                    text: "ID Class Daily",
                    align: "start",
                    sortable: true,
                    value: "id_class_running_daily",
                    class: "yellow lighten-1"
                },
                // { text: "ID Class Running", value: "id_class_running", class: "yellow lighten-1" },
                { text: "Instructor Name", value: "fullname", class: "yellow lighten-1" },
                { text: "Class Name", value: "class_name", class: "yellow lighten-1" },
                { text: "Start Time", value: "start_time", class: "yellow lighten-1" },
                { text: "Slot", value: "slot", class: "yellow lighten-1" },
                { text: "Day", value: "day", class: "yellow lighten-1" },
                { text: "Date", value: "date", class: "yellow lighten-1" },
                { text: "Status", value: "status", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            class_daily: [],
            class_running: [],
            instructors: [],
            formClassDaily: {
                id_instructor: null,
                status: null
            },
            formEdit: {
                id_instructor: null,
                status: null
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
        confirmSaveEdit(){
            let status = this.formEdit.status;
            axios.put("https://calvin.ppcdeveloper.com/api/class_running_dailies/" + this.id_class_daily_edit, {
                status: status,
            }).then((response) => {
                console.log(response)
                //reset
                this.formEdit = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil edit Class Running Daily';
                // this.dialogTambah = false;
                //reload
                this.getClassDaily();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialogEdit = false;
            this.dialogSaveEdit = false;
        },
        cancelSaveEdit(){
            this.dialogSaveEdit = false
            this.$nextTick(() => { this.edit = -1 })
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
        getClassRunning(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/class_runnings")
            .then((response) => {
                this.class_running = response.data.data;
                console.log(this.class_running)
            }).catch((error) => {
                console.log(error)
            });
        },
        generate(){
            axios.post("https://calvin.ppcdeveloper.com/api" + "/class_running_dailies").then((response) => {
                console.log(response)
                //reset

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil generate';
                this.dialogTambah = false;
                //reload
                this.getClassDaily();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
        },
        getClassDaily(){
            axios.get("https://calvin.ppcdeveloper.com/api" + "/class_running_dailies")
            .then((response) => {
                this.class_daily = response.data.data;
                console.log(this.class_daily)
            }).catch((error) => {
                console.log(error)
            });
        },
        save() {
            let id_instructor = this.formClassDaily.id_instructor;
            let status = this.formClassDaily.status;
            axios.post("https://calvin.ppcdeveloper.com/api" + "/class_running_dailies", {
                id_instructor: id_instructor,
                status: status,
            }).then((response) => {
                console.log(response)
                //reset
                this.formClassDaily = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil edit status';
                // this.dialogTambah = false;
                //reload
                this.getClassDaily();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialog = false;
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
            this.formClassDaily = {
                id_instructor: null,
                status: null,
            };
        },
        editItem(item){
            this.edit = this.class_daily.indexOf(item);
            this.id_class_daily_edit = this.class_daily[this.edit].id_class_running_daily;
            // this.formMember.email = item.email;
            // this.formMember.password = item.password;
            // this.formMember.birth_date = item.birth_date;
            // this.formMember.fullname = item.fullname;
            // this.formMember.cash_deposit = item.cash_deposit;
            this.formEdit = item;
            this.dialogEdit = true;
        },
        deleteItem(item){
            this.delete = this.class_daily.indexOf(item)
            this.id_class_daily_splice = this.class_daily.indexOf(item)
            this.id_class_daily_splice = this.class_daily[this.delete].id_class_running_daily
            this.dialogDelete = true
        },

        cancelDelete(){
            this.dialogDelete = false
            this.$nextTick(() => { this.delete = -1 })
        },

        confirmDelete(){
            this.class_daily.splice(this.id_class_daily_splice, 1)
            axios.delete("https://calvin.ppcdeveloper.com/api/class_running_dailies/" + this.id_class_daily_delete)
            this.snackbar.show = true;
            this.snackbar.color = 'success';
            this.snackbar.icon = 'mdi-check';
            this.snackbar.message = 'Berhasil delete Class Running Daily';
            this.cancelDelete()
        },
    },
    mounted(){
        this.getClassDaily();
        this.getClassRunning();
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