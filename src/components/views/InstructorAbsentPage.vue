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
                    <v-list-item-title class="headline">Instructor Absent Page</v-list-item-title>
                    <v-list-item-subtitle>Confirm Absent</v-list-item-subtitle>
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
                <v-btn color="success" dark @click="dialogAdd = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="instructor_absents" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2 red lighten-3" @click="confirmAbsent(item)"> Confirm </v-btn> 
                </template>
            </v-data-table>
        </v-card>
        <br><br>

        <v-dialog v-model="dialogAdd" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Form Confirm</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <!-- <v-select
                            v-model="formAbsent.id_instructor"
                            :items="instructors"
                            item-value="id_instructor"
                            item-text="fullname"
                            label="Instructor"
                            required
                        ></v-select> -->
                        <v-select
                            v-model="formAbsent.id_class_running_daily"
                            :items="class_running_dailies"
                            item-value="id_class_running_daily"
                            :item-text="item => `${item.class_name} - ${item.date} - ${item.start_time}`"
                            label="Choose class"
                            required
                        ></v-select>
                        <v-text-field
                            v-model="formAbsent.reason"
                            label="Reason"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="formAbsent.id_substitute_instructor"
                            :items="instructors"
                            item-value="id_instructor"
                            item-text="id_instructor"
                            label="Substitute Instructor"
                            required
                        ></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelAdd"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveAdd"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Form Confirm</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-select
                            v-model="formAbsent.is_confirmed"
                            label="Confirm Status"
                            :items="['Libur', 'Menggantikan']"
                            required
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

        <v-dialog v-model="dialogConfirm" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin konfirmasi instructor ini?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirm">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelConfirm">Tidak</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirmAdd" persistent max-width="480px">
            <v-card>
                <v-card-title>
                    <span class="headline">Anda yakin ingin menambah absen ini?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmAdd">Ya</v-btn>
                    <v-btn color="red darken-2" text @click="cancelConfirmAdd">Tidak</v-btn>
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
            dialogConfirm: false,
            id_absent: null,
            dialogAdd: false,
            dialogConfirmAdd: false,
            headers: [
                {
                    text: "ID Absent",
                    align: "start",
                    sortable: true,
                    value: "id_absent",
                    class: "yellow lighten-1"
                },
                { text: "ID Instructor", value: "fullname_instructor", class: "yellow lighten-1" },
                { text: "ID Class Running Daily", value: "class_name", class: "yellow lighten-1" },
                { text: "Reason", value: "reason", class: "yellow lighten-1" },
                { text: "ID Substitute Instructor", value: "pengganti_instructor", class: "yellow lighten-1" },
                { text: "is Confirmed", value: "is_confirmed", class: "yellow lighten-1" },
                { text: "Actions", value: "actions", class: "yellow lighten-1" },

            ],
            members: [],
            instructor_absents: [],
            instructors: [],
            susbtitute_instructor: [],
            class_running_dailies: [],
            formAbsent: {
                id_instructor: null,
                id_class_running_daily: null,
                reason: null,
                id_substitute_instructor: null,
                is_confirmed: null,
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
        getInstructors(){
            axios.get("http://calvin.ppcdeveloper.com/api" + "/instructors")
            .then((response) => {
                this.instructors = response.data.data;
            }).catch((error) => {
                console.log(error)
            });
        },
        getClassRunningDailies(){
            axios.get("http://calvin.ppcdeveloper.com/api" + "/class_running_dailiesAbsent")
            .then((response) => {
                this.class_running_dailies = response.data.data;
                console.log(response.data.data);
            }).catch((error) => {
                console.log(error)
            });
        },
        confirmAdd(){
            // id_instructor ini harusnya localStorage.getItem('id');
            let id_instructor = "23.04.003";
            let id_class_running_daily = this.formAbsent.id_class_running_daily;
            let reason = this.formAbsent.reason;
            let id_substitute_instructor = this.formAbsent.id_substitute_instructor;
            axios.post("http://calvin.ppcdeveloper.com/api" + "/instructor_absents", {
                id_instructor: id_instructor,
                id_class_running_daily: id_class_running_daily,
                reason: reason,
                id_substitute_instructor: id_substitute_instructor,
            }).then((response) => {
                console.log(response)
                //reset
                this.formAbsent = [];

                // this.snackbar.show = true;
                // this.snackbar.color = 'success';
                // this.snackbar.icon = 'mdi-check';
                // this.snackbar.message = 'Berhasil tambah';
                // this.dialogTambah = false;
                //reload
                this.getInstructorAbsent();
            }).catch((error) => {
                console.log(error)
                // this.snackbar.show = true;
                // this.snackbar.color = 'error';
                // this.snackbar.icon = 'mdi-close';
                // this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialogAdd = false;
            this.dialogConfirmAdd = false;
        },
        cancelConfirmAdd(){
            this.dialogConfirmAdd = false;
        },
        cancelAdd(){
            this.dialogAdd = false;
        },
        saveAdd(){
            this.dialogConfirmAdd = true;
        },
        save(){
            this.dialogConfirm = true;
        },
        cancel(){
            this.dialog = false;
        },
        confirmAbsent(item){
            this.id_absent = item.id_absent;
            this.dialog = true;
        },
        confirm(){
            let is_confirmed = this.formAbsent.is_confirmed;
            axios.put("http://calvin.ppcdeveloper.com/api/instructor_absents/" + this.id_absent, {
                is_confirmed: is_confirmed
            }).then((response) => {
                console.log(response)
                this.formAbsent = [];

                this.snackbar.show = true;
                this.snackbar.color = 'success';
                this.snackbar.icon = 'mdi-check';
                this.snackbar.message = 'Berhasil confirm';

                //reload
                this.getInstructorAbsent();
            }).catch((error) => {
                console.log(error)
                this.snackbar.show = true;
                this.snackbar.color = 'error';
                this.snackbar.icon = 'mdi-close';
                this.snackbar.message = error.response.data.message;
            });
            this.resetForm();
            this.dialog = false;
            this.dialogConfirm = false;
        },
        cancelConfirm(){
            this.dialogConfirm = false;
        },
        getInstructorAbsent(){
            axios.get("http://calvin.ppcdeveloper.com/api" + "/instructor_absents")
            .then((response) => {
                this.instructor_absents = response.data.data;
                console.log(this.instructor_absents);
            }).catch((error) => {
                console.log(error)
            });
        },
        resetForm() {
            this.formAbsent = {
                is_confirmed: null,
            };
        },
    },
    mounted(){
        this.getInstructorAbsent();
        this.getInstructors();
        this.getClassRunningDailies();
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