// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBe6dWgnpCL0VVMv2d-SzCs8anS_NFWGy0",
  authDomain: "agrofarma-8d887.firebaseapp.com",
  projectId: "agrofarma-8d887",
  storageBucket: "agrofarma-8d887.firebasestorage.app",
  messagingSenderId: "32789536381",
  appId: "1:32789536381:web:e84c89c1aaf72eb3fb9b14",
  measurementId: "G-N60MBYHBRK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
