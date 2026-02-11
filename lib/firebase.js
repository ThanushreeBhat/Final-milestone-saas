import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCC6YNUVs-gw0tSfvsAQFiBCHNADbc61S8",
  authDomain: "milestone2-saas.firebaseapp.com",
  projectId: "milestone2-saas",
  storageBucket: "milestone2-saas.firebasestorage.app",
  messagingSenderId: "866248501656",
  appId: "1:866248501656:web:0d27d951a480e5ea1ee3ed",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
