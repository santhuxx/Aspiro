import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAme-ANS_hDPfJZ5p1X4tlluikAg7w7ryM",
    authDomain: "aspiro-cd987.firebaseapp.com",
    projectId: "aspiro-cd987",
    storageBucket: "aspiro-cd987.firebasestorage.app",
    messagingSenderId: "946918739330",
    appId: "1:946918739330:web:e533b54a6814e5f1ce539b"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
