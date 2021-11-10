//import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeYGyocxpYNWbChSRoLVbdeiZcDVDWjV4",
  authDomain: "react-native-exam-8ee5c.firebaseapp.com",
  projectId: "react-native-exam-8ee5c",
  storageBucket: "react-native-exam-8ee5c.appspot.com",
  messagingSenderId: "124116186280",
  appId: "1:124116186280:web:29d8e17f4bc1b313b1fe9d"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0)
    app = firebase.initializeApp(firebaseConfig)
else
    app = app.firebase()

const auth = firebase.auth()
const db = firebase.firestore(app)