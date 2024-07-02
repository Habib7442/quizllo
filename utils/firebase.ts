import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
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
