
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const signup = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    favorites: [] 
  });

  return user;
};

export async function login(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        throw new Error("No account found with this email.");
      case "auth/wrong-password":
        throw new Error("Incorrect password. Please try again.");
      case "auth/invalid-email":
        throw new Error("The email address is badly formatted.");
      case "auth/too-many-requests":
        throw new Error("Too many failed attempts. Please try again later.");
      default:
        throw new Error("Login failed. Please try again.");
    }
  }
}
