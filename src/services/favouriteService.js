
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addFavorite = async (uid, movie) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    let favorites = [];

    if (userSnap.exists()) {
      favorites = userSnap.data().favorites || [];
    }

    const alreadyExists = favorites.some(fav => fav.id === movie.id);
    if (!alreadyExists) {
      favorites.push(movie);
      await setDoc(userRef, { favorites }, { merge: true });
      console.log("Favorite added to Firestore!");
    } else {
      console.log("Movie already in favorites.");
    }
  } catch (err) {
    console.error("Error adding favorite:", err);
  }
};

export const getFavorites = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().favorites || [];
  }
  return [];
};

export const removeFavorite = async (uid, movie) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const favorites = userSnap.data().favorites || [];
    const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);

    await setDoc(userRef, { favorites: updatedFavorites }, { merge: true });

    console.log("✅ Movie removed from favorites.");
  } catch (err) {
    console.error("❌ Error removing favorite:", err);
  }
};

export const toggleFavorite = async (uid, movie) => {
  const favorites = await getFavorites(uid);
  const isFav = favorites.some(f => f.id === movie.id);
  if (isFav) {
    await removeFavorite(uid, movie);
  } else {
    await addFavorite(uid, movie);
  }
  return !isFav;
};

