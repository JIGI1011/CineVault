import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";

export const addToWatchlist = async (userId, movie) => {
  const ref = doc(db, "users", userId, "watchlist", movie.id.toString());
  await setDoc(ref, {
    ...movie,
    addedAt: new Date()
  });
};

export const removeFromWatchlist = async (userId, movieId) => {
  const ref = doc(db, "users", userId, "watchlist", movieId.toString());
  await deleteDoc(ref);
};

export const getUserWatchlist = async (userId) => {
  const listRef = collection(db, "users", userId, "watchlist");
  const snapshot = await getDocs(listRef);
  return snapshot.docs.map(doc => doc.data());
};
