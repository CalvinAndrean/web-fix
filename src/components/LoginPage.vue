<template>
   <v-app id="inspire">
      <v-content>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Login form</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form @submit.prevent="login()">
                           <v-text-field
                              prepend-icon="mdi-person"
                              name="login"
                              v-model="users.email"
                              label="Login"
                              type="text"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              prepend-icon="mdi-lock"
                              name="password"
                              v-model="users.password"
                              label="Password"
                              type="password"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <!-- ARAHIN KE AXIOS BLOM BISA INI -->
                        <v-btn color="primary" type="submit" @click="login">Login</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-content>
   </v-app>
</template>

<script>
   import axios from 'axios'
  import router from '@/router'
   import { reactive, ref } from "vue";

   export default {
       setup() {
           
           const users = reactive({
               email: '',
               password: ''
           })
           // const token = ref('')
           const message = ref('')
           // const router = useRouter()
           const validation = ref([])
           const URL_LINK = "https://calvin.ppcdeveloper.com/api"

           function login(){
               axios.post(`${URL_LINK}/login`, {
                   email: users.email,
                   password: users.password
               }).then((response) => {
                 // let session_token = response.data.data.token;
                 // $cookies.set("SESSION", session_token);
                   // save token to local storage
                   // localStorage.setItem('token', response.data.access_token)
                   localStorage.setItem('user', response.data.user.id)
                   localStorage.setItem('role', response.data.user.role)
                   localStorage.setItem('id', response.data.user.id_user)
                   // console.log(localStorage.getItem('token'))
                   console.log("Berhasil log in");
                   router.push({name: 'dashboardIndex'})

               })
              //  .catch(error => {
              //      // alert(error.response.data.message)
              //      // alert(error.response.data.message)
              //    //   message.value = error.response.data.message
              //    //   validation.value = error.response.data.errors
              // })
           }
           return {
               login,
               users,
               message,
               // token,
               validation,
               router
           }
       }
   }
</script>

<style>
   .divider:after,
   .divider:before {
   content: "";
   flex: 1;
   height: 1px;
   background: #eee;
   }
</style>