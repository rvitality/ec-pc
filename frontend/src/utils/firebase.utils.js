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
    apiKey: "AIzaSyAieV3qJe6kTSBvYKsXryBwQoVUASjXbQ8",
    authDomain: "ec-pc-1d3b2.firebaseapp.com",
    projectId: "ec-pc-1d3b2",
    storageBucket: "ec-pc-1d3b2.appspot.com",
    messagingSenderId: "796667821318",
    appId: "1:796667821318:web:ac588da1b14de6835eb287",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(firebaseApp);

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
    const userDocRef = doc(db, "users", userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        const { displayName, accessToken, uid, email, metadata, photoURL } = userAuth;
        const userData = {
            name: displayName,
            email,
            photoURL,
            records: [],
            selectedAppliances: [],
            role: "user",
        };

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

export const getCollections = async (collectionName = "") => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
    }));
};

// ! GET SINGLE DOCUMENT/USER
export const getUserData = async userID => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("User doesn't exist.");
        return {};
    }
};

// ! UPDATE USER DATA, ADD/UPDATE NEW ELECTRIC BILL
export const updateUserRecords = async userData => {
    try {
        const { id, records } = userData;
        const documentRef = doc(db, "users", id);
        await updateDoc(documentRef, { records });
    } catch (err) {
        console.log(err);
    }
};

// ! UPDATE USER SELECTED APPLIANCES, ADD/UPDATE NEW ELECTRIC BILL
export const updateUserAppliances = async userData => {
    try {
        const { id, selectedAppliances } = userData;
        const documentRef = doc(db, "users", id);
        await updateDoc(documentRef, { selectedAppliances });
    } catch (err) {
        console.log(err);
    }
};

// ! ADD/UPDATE PREDICTED RATE
export const updatePredictedRates = async ratesData => {
    try {
        const { id, predictedRates } = ratesData;
        const documentRef = doc(db, "predictedRates", id);
        return await updateDoc(documentRef, { predictedRates });
    } catch (err) {
        console.log(err);
    }
};
