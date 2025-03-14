import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPfU2pqROLqgf5Fo4gekzY0-ycyG_3iI0",
  authDomain: "mobliewebproject.firebaseapp.com",
  projectId: "mobliewebproject",
  storageBucket: "mobliewebproject.firebasestorage.app",
  messagingSenderId: "16500471511",
  appId: "1:16500471511:web:eed3142ca86deaf3ce6292",
  measurementId: "G-5SEG550KEX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
