// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDxokSaaGycK2DVm_VZcmkjtJyLKDg_oVk",
    authDomain: "hotel-hilton-web.firebaseapp.com",
    projectId: "hotel-hilton-web",
    storageBucket: "hotel-hilton-web.firebasestorage.app",
    messagingSenderId: "264941131879",
    appId: "1:264941131879:web:9b54ce4bb1e2ce53d15cc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Inicializa Firebase Authentication y exportamos para usarlo en otros lugares
export const auth = getAuth(app);