// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqVuARJK0QT5veFxvEAT6qsv8F7G_KvXs",
  authDomain: "captracker-13af0.firebaseapp.com",
  projectId: "captracker-13af0",
  storageBucket: "captracker-13af0.firebasestorage.app",
  messagingSenderId: "110396035674",
  appId: "1:110396035674:web:f2149f3dbc00e10f593e63",
  measurementId: "G-JZLS9S93RR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);