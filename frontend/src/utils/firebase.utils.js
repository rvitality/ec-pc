import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    updateDoc,
    query,
    getDocs,
} from "firebase/firestore";

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
export const db = getFirestore();

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account",
});

// ! AUTHENTICATION =============================

export const signInAuthWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = callback => onAuthStateChanged(auth, callback);

export const createUserDocumentFromAuth = async (userAuth, additionalInfo) => {
    console.log(userAuth);
    const userDocRef = doc(db, "users", userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        const { displayName, accessToken, uid, email, metadata, photoURL } = userAuth;
        const userData = {
            name: displayName,
            email,
            photoURL,
        };

        if (uid === "KgGL9ntc4IRouwtjBSGfusfd28r1") {
            userData["role"] = "admin";
        } else {
            userData["role"] = "user";
        }

        try {
            await setDoc(userDocRef, {
                ...userData,
                ...additionalInfo,
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    return userSnapshot;
};

// ! FIRESTORE DATABASE =============================

export const getAppliancesAndDocuments = async () => {
    const collectionRef = collection(db, "appliances");
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docSnapshot => ({
        id: uuidv4(),
        category: docSnapshot.id,
        ...docSnapshot.data(),
    }));
};

// ! GET SINGLE DOCUMENT/USER
export const getUserData = async userID => {
    // console.log(userID);
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return {};
    }
};
