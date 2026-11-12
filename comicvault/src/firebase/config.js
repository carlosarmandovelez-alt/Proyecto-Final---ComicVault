// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅

const firebaseConfig = {
    apiKey: "AIzaSyBkYllPFOn2APTvW54npqIbKfuxExAe5nY",
    authDomain: "comicvault-xxxx.firebaseapp.com",
    projectId: "comicvault-xxxx",
    storageBucket: "comicvault-xxxx.firebasestorage.app",
    messagingSenderId: "487361718286",
    appId: "1:487361718286:web:1375508012f5de6fe5345f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ EXPORT

export default app;