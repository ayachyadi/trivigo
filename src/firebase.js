import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Silakan ganti objek di bawah ini dengan config asli dari Firebase Console Anda nanti
const firebaseConfig = {
  apiKey: "AIzaSyAlR2o6nw9ZFfhyJw00_tDBvF0XIa_V6tk",
  authDomain: "trivigo.firebaseapp.com",
  projectId: "trivigo",
  databaseURL: "https://trivigo-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "trivigo.firebasestorage.app",
  messagingSenderId: "51413677744",
  appId: "1:51413677744:web:058124967eec8182a6ad75"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Realtime Database
export const db = getDatabase(app);