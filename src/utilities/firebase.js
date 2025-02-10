

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const firebaseConfig = {
    apiKey: "AIzaSyACYg-tB7jhH6fueLUXtJWVK7mM7-fSEBo",
    authDomain: "ubiqumreact.firebaseapp.com",
    databaseURL: "https://ubiqumreact-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ubiqumreact",
    storageBucket: "ubiqumreact.firebasestorage.app",
    messagingSenderId: "492060218809",
    appId: "1:492060218809:web:fab4f247dbcee0374e5268",
    measurementId: "G-2V548284RJ"
};

const firebase = initializeApp(firebaseConfig);
export const database = getDatabase(firebase);

export const setData = (path, value) => (
    set(ref(database, path), value)
);

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

export const useUserState = () => useAuthState(getAuth(firebase));