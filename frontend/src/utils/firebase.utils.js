import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBMOS0BuvMJID8zhCDIYjaQRxBc5Y4bSEI",
    authDomain: "ec-pc-d04a2.firebaseapp.com",
    projectId: "ec-pc-d04a2",
    storageBucket: "ec-pc-d04a2.appspot.com",
    messagingSenderId: "802468401688",
    appId: "1:802468401688:web:b132ee38674f31485ae96d",
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth();

export const signInAuthWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
};
