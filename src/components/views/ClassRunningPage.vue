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
                    <v-list-item-title class="headline">Class Running Page</v-list-item-title>
                    <v-list-item-subtitle>CRUDS Class Running</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="class_running" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 blue lighten-3" @click="editItem(item)"> <span class="mdi mdi-pencil"></span> </v-btn>
                    <v-btn small class="mr-2 red lighten-3" @click="deleteItem(item)"> <span class="mdi mdi-trash-can-outline"></span> </v-btn>                    
                </template>

                <!-- <template v-slot:[`item.id_instructor`]="{ item, index }">
                    {{ item }}
                    {{ index }}
                </template> -->

            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Class Running</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select
                            v-model="formClassRunning.id_instructor" 
                            :items="instructors" 
                            item-value="id_instructor" 
                            item-text="fullname"
                            label="Instructor"
                            required
                            :rules="[v => !!v || 'Instructor is required']"
                        ></v-select>
                        <v-select
                            v-model="formClassRunning.id_class"
                            :items="class_details"
                            item-value="id_class"
                            item-text="class_name"
                            label="Class"
                            required
                            :rules="[v => !!v || 'Class is required']"
                        ></v-select>
                        <h4>Start Time</h4>
                        <v-time-picker
                            v-model="formClassRunning.start_time"
                            label="Start Time"
                            required
                            :rules="[v => !!v || 'Start Time is required']"
                        ></v-time-picker>
                        <h4>End Time</h4>
                        <v-time-picker
                            v-model="formClassRunning.end_time"
                            label="End Time"
                            required
                            :rules="[v => !!v || 'End Time is required']"
                        ></v-time-picker>
                        <v-text-field
                            v-model="formClassRunning.slot"
                            label="Slot"
                            required
                            :rules="[v => !!v || 'Slot is required']"
                        ></v-text-field>
                        <v-select
                            v-model="formClassRunning.day"
                            label="Day"
                            :items="['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']"
                            required
                            :rules="[v => !!v || 'Day is required']"
                        ></v-select>
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
                        <v-select
                            v-model="formEdit.id_instructor" 
                            :items="instructors" 
                            item-value="id_instructor" 
                            item-text="fullname"
                        ></v-select>
                        <v-select
                            v-model="formEdit.id_class"
                            :items="class_details"
                            item-value="id_class"
                            item-text="class_name"
                        ></v-select>
                        <h4>Start Time</h4>
                        <v-time-picker
                            v-model="formEdit.start_time"
                            label="Start Time"
                            required
                        ></v-time-picker>
                        <h4>End Time</h4>
                        <v-time-picker
                            v-model="formEdit.end_time"
                            label="End Time"
                            required
                        ></v-time-picker>
                        <v-text-field
                            v-model="formEdit.slot"
                            label="Slot"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="formEdit.day"
                            label="Day"
                            :items="['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']"
                        ></v-select>
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
            id_class_running_edit: null,
            id_class_running_delete: null,
            id_class_running_splice: null,
            search: null,
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            snackbar: {
                show: false,
                color: '',
                icon: '',
                message: '',
            },
            headers: [
                {
                    text: "ID Class Running",
                    align: "start",
                    sortable: true,
                    value: "id_class_running",
                    class: "yellow lighten-1"
                },
                { text: "Instructor Name", value: "instructor.fullname", key: "fullname", class: "yellow lighten-1" },
                { text: "Class Name", value: "class_details.class_name", class: "yellow lighten-1" },
                { text: "Day", value: "day", class: "yellow lighten-1" },
                { text: "Start Time", value: "start_time", class: "yellow lighten-1" },
                { text: "End Time", value: "end_time", class: "yellow lighten-1" },
                { text: "Slot", value: "slot", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },
            ],
            class_running: [],
            instructors: [],
            class_details: [],
            formClassRunning: {
                id_instructor: null,
                id_class: null,
                start_time: null,
                end_time: null,
                slot: null,
                day: null,
            },
            formEdit: {
                id_instructor: null,
                id_class: null,
                start_time: null,
                end_time: null,
                slot: null,
                day: null,
            },
        };
    },
    methods: {
        getInstructors(){
            axios.get("http://127.0.0.1:8000/api" + "/instructors")
            .then((response) => {
                this.instructors = response.data.data;
                console.log(this.instructors)
            }).catch((error) => {
                console.log(error)
            });
        },
        getClassDetails(){
            axios.get("http://127.0.0.1:8000/api" + "/class_details")
            .then((response) => {
                this.class_details = response.data.data;
                console.log(this.class_details)
            }).catch((error) => {
                console.log(error)
            });
        },
        getClassRunning(){
            axios.get("http://127.0.0.1:8000/api" + "/class_runnings")
            .then((response) => {
                this.class_running = response.data.data;
                console.log(this.class_running)
            }).catch((error) => {
                console.log(error)
            });
        },
        save() {
            let id_instructor = this.formClassRunning.id_instructor;
            let id_class = this.formClassRunning.id_class;
            let start_time = this.formClassRunning.start_time;
            let end_time = this.formClassRunning.end_time;
            let slot = this.formClassRunning.slot;
            let day = this.formClassRunning.day;
            axios.post("http://127.0.0.1:8000/api" + "/class_runnings", {
                id_instructor: id_instructor,
                id_class: id_class,
                start_time: start_time,
                end_time: end_time,
                slot: slot,
                day: day,
            }).then((response) => {
                console.log(response)
                //reset
                this.formClassRunning = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Success add class running';
                this.dialogTambah = false;
                //reload
                this.getClassRunning();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            if(this.formClassRunning.id_instructor == null || this.formClassRunning.id_class == null || this.formClassRunning.start_time == null
            || this.formClassRunning.end_time == null || this.formClassRunning.slot == null || this.formClassRunning.day == null){
                this.dialog = true;
            } else{
                this.dialog = false;
                this.resetForm();
            }
        },
        saveEdit(){
            let id_instructor = this.formEdit.id_instructor;
            let id_class = this.formEdit.id_class;
            let start_time = this.formEdit.start_time;
            let end_time = this.formEdit.end_time;
            let slot = this.formEdit.slot;
            let day = this.formEdit.day;
            axios.put("http://127.0.0.1:8000/api/class_runnings/" + this.id_class_running_edit, {
                id_instructor: id_instructor,
                id_class: id_class,
                start_time: start_time,
                end_time: end_time,
                slot: slot,
                day: day,
            }).then((response) => {
                console.log(response)
                //reset
                this.formEdit = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Success edit class running';
                this.dialogTambah = false;
                //reload
                this.getClassRunning();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
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
            this.formClassRunning = {
                id_instructor: null,
                id_class: null,
                start_time: null,
                end_time: null,
                slot: null,
                day: null,
            };
        },
        editItem(item){
            this.edit = this.class_running.indexOf(item);
            this.id_class_running_edit = this.class_running[this.edit].id_class_running;
            // this.formMember.email = item.email;
            // this.formMember.password = item.password;
            // this.formMember.birth_date = item.birth_date;
            // this.formMember.fullname = item.fullname;
            // this.formMember.cash_deposit = item.cash_deposit;
            this.formEdit = item;
            console.log(this.formEdit);
            this.dialogEdit = true;
        },
        deleteItem(item){
            this.delete = this.class_running.indexOf(item)
            this.id_class_running_splice = this.class_running.indexOf(item)
            this.id_class_running_delete = this.class_running[this.delete].id_class_running
            this.dialogDelete = true
        },

        cancelDelete(){
            this.dialogDelete = false
            this.$nextTick(() => { this.delete = -1 })
        },

        confirmDelete(){
            this.class_running.splice(this.id_class_running_splice, 1)
            axios.delete("http://127.0.0.1:8000/api/class_runnings/" + this.id_class_running_delete)
            this.cancelDelete()
        },
    },
    mounted(){
        this.getClassRunning();
        this.getInstructors();
        this.getClassDetails();

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