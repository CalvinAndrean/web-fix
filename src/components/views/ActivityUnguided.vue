<template>
    <v-main class="list">
        <link
            href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css"
            rel="stylesheet"
        /> 
        <v-card>
            <v-list-item>
                <v-list-item-avatar color="grey"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">To Do List</v-list-item-title>
                    <v-list-item-subtitle>by 200710906</v-list-item-subtitle>
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
            <v-data-table :headers="headers" :items="todos" :search="search" :expanded-sync="expanded" item-key="note" show-expand>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-row>
                        <v-btn small class="ma-2" outlined fab color="red lighten-1" @click="editItem(item)">
                            <v-icon color="red lighten-1">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn small class="ma-2" outlined fab color="green lighten-1" @click="deleteItem(item)">
                            <v-icon color="green lighten-1">mdi-trash-can-outline</v-icon>
                        </v-btn>
                    </v-row>                                     
                </template>

                <template v-slot:[`item.priority`]="{ item }">
                    <v-icon v-show="item.priority == 'Urgent'" color="red" @click="snackbarU = true">
                        mdi-alert-octagon
                    </v-icon>

                    <v-icon v-show="item.priority == 'Normal'" color="yellow" @click="snackbarN = true">
                        mdi-alert-octagon
                    </v-icon>

                    <v-icon v-show="item.priority == 'Not Important'" color="blue" @click="snackbarNI = true">
                        mdi-alert-octagon
                    </v-icon>

                    <v-snackbar v-model="snackbarU" :timeout="timeout" color="red" v-show="item.priority == 'Urgent'" rounded="pill" top right>
                        <v-icon color="white">mdi-alarm-light</v-icon> Notes Priority : {{item.priority}}
                    </v-snackbar>

                    <v-snackbar v-model="snackbarN" :timeout="timeout" color="yellow" v-show="item.priority == 'Normal'" rounded="pill" top left>
                        <v-icon color="white">mdi-pause</v-icon> Notes Priority : {{item.priority}}
                    </v-snackbar>

                    <v-snackbar v-model="snackbarNI" :timeout="timeout" color="blue" v-show="item.priority == 'Not Important'" rounded="pill">
                        <v-icon color="white">mdi-heart</v-icon> Notes Priority : {{item.priority}}
                    </v-snackbar>
                </template>

                <template v-slot:expanded-item="{ item, headers }">
                    <td :colspan="headers.length">
                        <v-card v-if="item.priority == 'Urgent'" color="red">
                            <div>
                                <v-chip class="mb-4 mt-4" color="red lighten-1" text-color="white">
                                    <v-icon left>mdi-fire</v-icon>
                                    {{ item.priority }}
                                </v-chip>
                            </div>

                            <div>
                                <v-chip class="ma-2" color="yellow darken-2" text-color="white">
                                    <v-icon left>mdi-note</v-icon>
                                    Note Task: {{ item.note }}
                                </v-chip>
                            </div>
                        </v-card>

                        <v-card v-if="item.priority == 'Normal'" color="yellow">
                            <div>
                                <v-chip class="mb-4 mt-4" color="yellow darken-2" text-color="white">
                                    <v-icon left>mdi-fire</v-icon>
                                    {{ item.priority }}
                                </v-chip>                             
                            </div>

                            <div>
                                <v-chip class="ma-2" color="yellow darken-2" text-color="white">
                                    <v-icon left>mdi-note</v-icon>
                                    Note Task: {{ item.note }}
                                </v-chip>
                            </div>
                        </v-card>

                        <v-card v-if="item.priority == 'Not Important'" color="blue">
                            <div>
                                <v-chip class="mb-4 mt-4" color="blue lighten-1" text-color="white">
                                    <v-icon left>mdi-fire</v-icon>
                                    {{ item.priority }}
                                </v-chip>
                            </div>

                            <div>
                                <v-chip class="ma-2" color="yellow darken-2" text-color="white">
                                    <v-icon left>mdi-note</v-icon>
                                    Note Task: {{ item.note }}
                                </v-chip>
                            </div>
                        </v-card>
                    </td>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headine"> Form Todo List</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.task" label="Task" required></v-text-field>

                        <v-select v-model="formTodo.priority" :items="['Urgent', 'Normal', 'Not Important']"
                            label="Priority" required>
                        </v-select>

                        <v-textarea v-model="formTodo.note" label="Note" required></v-textarea>

                        <v-select v-model="formTodo.status" :items="['Selesai', 'Belum Selesai']" label="Status"
                            required>
                        </v-select>
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
                <v-card-title class="pink"> 
                    <span class="headine"> Form Todo </span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.task" label="Task" required></v-text-field>

                        <v-select v-model="formTodo.priority" :items="['Urgent', 'Normal', 'Not Important']"
                            label="Priority" required>
                        </v-select>

                        <v-textarea v-model="formTodo.note" label="Note" required></v-textarea>

                        <v-select v-model="formTodo.status" :items="['Selesai', 'Belum Selesai']" label="Status"
                            required>
                        </v-select>
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
                    <span class="headline">Are you sure to delete?</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-actions>
                    <v-btn color="green darken-2" text @click="confirmDelete">Yes</v-btn>
                    <v-btn color="red darken-2" text @click="cancelDelete">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
export default{
    name: "ListItem",
    data() {
        return {
            search: null,
            dialog: false,
            dialogDelete: false,
            dialogEdit: false,
            snackbarU : true,
            snackbarN : true,
            snackbarNI : true,
            timeout: 3000,
            delete : -1,
            headers: [
                {
                    text: "Task",
                    align: "start",
                    sortable: true,
                    value: "task",
                },
                { text: "Priority", value: "priority" },
                //{ text: "Note", value: "note" },
                { text: "Status", value: "status" },
                { text: "Actions", value: "actions" },
            ],
            todos: [
                {
                    task: "Coding",
                    priority: "Urgent",
                    note: "Code for your life",
                    status: "Belum Selesai",
                },
                {
                    task: "Cooking",
                    priority: "Normal",
                    note: "Indomie saat begadang ngerjain coding terbaek",
                    status: "Selesai",                    
                },
                {
                    task: "Gaming",
                    priority: "Not Important",
                    note: "Wasting time",
                    status: "Belum Selesai",
                },
            ],
            formTodo: {
                task: null,
                priority: null,
                note: null,
                status: null,
            },
            editTodo:{
                task: null,
                priority: null,
                note: null,
                status: null,
            }
        };
    },
    methods: {
        save() {
            this.todos.push(this.formTodo);
            this.resetForm();
            this.dialog = false;
        },
        saveEdit(){
            this.editTodo.task = this.formTodo.task
            this.editTodo.priority = this.formTodo.priority
            this.editTodo.note = this.formTodo.note
            this.editTodo.status = this.formTodo.status
            this.dialogEdit = false
        },
        cancelEdit(){
            this.resetForm();
            this.dialogEdit = false;
        },
        cancel() {
            this.resetForm();
            this.dialog = false;
        },
        resetForm() {
            this.formTodo = {
                task: null,
                priority: null,
                note: null,
                status: null,
            };
        },

        editItem(item){
            this.edit = this.todos.indexOf(item);
            this.formTodo.task = item.task;
            this.formTodo.priority = item.priority;
            this.formTodo.note = item.note;
            this.formTodo.status = item.status;
            this.editTodo = item
            this.dialogEdit = true;
        },

        deleteItem(item){
            this.delete = this.todos.indexOf(item)
            this.editTodo = item
            this.dialogDelete = true
        },

        cancelDelete(){
            this.dialogDelete = false
            this.$nextTick(() => { this.delete = -1 })
        },

        confirmDelete(){
            this.todos.splice(this.delete, 1)
            this.cancelDelete()
        }
    },
};
</script>
<style>
    .text {
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 40px;
        font-style: italic;
    }
</style>