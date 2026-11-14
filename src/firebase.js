import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvqS-52hixvnpuF7Y-VXD-WdoyqyXQft8",
  authDomain: "prize-master-ad16a.firebaseapp.com",
  projectId: "prize-master-ad16a",
  storageBucket: "prize-master-ad16a.firebasestorage.app",
  messagingSenderId: "188887494112",
  appId: "1:188887494112:web:38a5f9a1a4f5f06bc20f85"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
