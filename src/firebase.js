// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV4sb8FUxUJhX5Y_EBCZxbOkigeFHFw74",
  authDomain: "blogapp-wattech.firebaseapp.com",
  projectId: "blogapp-wattech",
  storageBucket: "blogapp-wattech.firebasestorage.app",
  messagingSenderId: "135337795393",
  appId: "1:135337795393:web:f1e4454f8ae56be5b04bc0",
  measurementId: "G-QTXGVFNKD3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { db, auth, provider, storage };
