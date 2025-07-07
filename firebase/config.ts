// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBzYXCTamV2jozBP__5-WTbmlGGYI9FU98",
  authDomain: "controloficina-c84e8.firebaseapp.com",
  projectId: "controloficina-c84e8",
  storageBucket: "controloficina-c84e8.firebasestorage.app",
  messagingSenderId: "266569054604",
  appId: "1:266569054604:web:64850a4f19bae3fb97fea9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);