// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "engineers-toolkit-l94eh",
  "appId": "1:1046003203140:web:96f7eae5419592d36c1011",
  "storageBucket": "engineers-toolkit-l94eh.firebasestorage.app",
  "apiKey": "AIzaSyDwSsYSZbF5LIicLjj-QfmOX4jiS6Y_I9I",
  "authDomain": "engineers-toolkit-l94eh.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1046003203140"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
