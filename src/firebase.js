import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  //tambahkan firebaseConfig project
  apiKey: "AIzaSyD3qJBillXpEIcBSs7YtcNvqvfGOzaU_Ck",
  authDomain: "vuefire0932.firebaseapp.com",
  projectId: "vuefire0932",
  storageBucket: "vuefire0932.appspot.com",
  messagingSenderId: "819705317921",
  appId: "1:819705317921:web:6712cd3673f583b9337160"
}

//tambahkan code untuk menginisialisasikan Firebase
const firebaseApp = initializeApp(firebaseConfig);

//tambahkan code untuk menginisialisasikan Realtime Database 
//dan mendapatkan referensi ke database tersebut
export const db = getDatabase(firebaseApp, "https://vuefire0932-default-rtdb.asia-southeast1.firebasedatabase.app/");