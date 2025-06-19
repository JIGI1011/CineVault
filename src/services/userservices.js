import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export const deleteAccount = async (password) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently logged in.");

  try {
    
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.error("Reauthentication failed:", error.message);
    throw new Error("Reauthentication failed. Please check your password.");
  }

  try {
    
    await deleteDoc(doc(db, "users", user.uid));
  } catch (err) {
    console.warn("Firestore data deletion failed:", err.message);
  }

  try {
    
    await deleteUser(user);
  } catch (error) {
    console.error("Firebase Auth deletion failed:", error.message);
    throw error;
  }
};
