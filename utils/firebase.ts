import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  updateDoc,
  FieldValue,
  arrayUnion,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2u4oRWeiD7DQzDp9PhjmlQtAIXZVfP4c",
  authDomain: "silken-dogfish-425903-h6.firebaseapp.com",
  databaseURL: "https://silken-dogfish-425903-h6-default-rtdb.firebaseio.com",
  projectId: "silken-dogfish-425903-h6",
  storageBucket: "silken-dogfish-425903-h6.appspot.com",
  messagingSenderId: "769462926678",
  appId: "1:769462926678:web:4f555635771453e40baaf7",
  measurementId: "G-35V8W3NSZR",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const auth = getAuth();

const signUpWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    // Sign in with Google popup
    const result = await signInWithPopup(auth, provider);

    // Access user information
    const user = result.user;
    console.log("User signed in:", user.displayName, user.email);
    // You can handle user data as needed (e.g., store it in your database)

    return user; // Return the user object if needed
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error signing in with Google:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};

export { db, storage, auth, signUpWithGoogle };
export default app;
