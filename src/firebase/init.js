// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1_U5GRgn0hAcIe7VUfKIhccUsaywod8I",
  authDomain: "train-ticket-booking-41371.firebaseapp.com",
  projectId: "train-ticket-booking-41371",
  storageBucket: "train-ticket-booking-41371.appspot.com",
  messagingSenderId: "210171112308",
  appId: "1:210171112308:web:7f6654046e59e6c0e21a21",
  measurementId: "G-3NQMWS1YCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize firestore
export const db = getFirestore(app)
export const auth = getAuth()