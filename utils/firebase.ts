import { initializeApp } from "firebase/app";

import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

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
    await createUserInFirestore(user);
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

const createUserInFirestore = async (user: any) => {
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
    });
    console.log("User data saved in Firestore");
  } catch (error) {
    console.error("Error saving user data in Firestore:", error);
    throw error;
  }
};

const fetchDocumentsByCollectionName = async (
  collectionName: string
): Promise<QuerySnapshot<DocumentData>> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot;
};

const saveFeedback = async (feedbackData: any) => {
  const db = getFirestore();
  try {
    const feedbackRef = doc(collection(db, "feedback"), feedbackData.uid);
    await setDoc(feedbackRef, feedbackData);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const fetchScores = async (collectionName: string) => {
  try {
    const db = getFirestore();
    const leaderboardRef = collection(
      db,
      "leaderboard",
      collectionName,
      "scores"
    );
    const querySnapshot = await getDocs(leaderboardRef);
    const scores = querySnapshot.docs.map((doc) => doc.data());
    return scores;
  } catch (error) {
    console.log(error);
  }
};

export {
  db,
  storage,
  auth,
  signUpWithGoogle,
  fetchDocumentsByCollectionName,
  saveFeedback,
  fetchScores,
};
export default app;
