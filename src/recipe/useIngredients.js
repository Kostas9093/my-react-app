// src/useIngredients.js
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useIngredients({ realtime = true } = {}) {
  const [ingredients, setIngredients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const colRef = collection(db, "ingredients"); // <-- collection must exist exactly like this

    if (realtime) {
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          const data = {};
          snapshot.forEach((doc) => {
            const d = doc.data() || {};
            const displayName = (d.name || doc.id || "").toString().trim();
            const key = displayName;
            data[key] = {
              unit: d.unit || "g",
              calories: Number(d.calories) || 0,
              protein: Number(d.protein) || 0,
              carbs: Number(d.carbs) || 0,
              fat: Number(d.fat) || 0,
              _displayName: displayName,
              _id: doc.id,
            };
          });
          console.debug("[useIngredients] snapshot size:", snapshot.size, "keys:", Object.keys(data).slice(0,10));
          setIngredients(data);
          setLoading(false);
        },
        (err) => {
          console.error("[useIngredients] onSnapshot error:", err);
          setError(err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      (async () => {
        try {
          const snapshot = await getDocs(colRef);
          const data = {};
          snapshot.forEach((doc) => {
            const d = doc.data() || {};
            const displayName = (d.name || doc.id || "").toString().trim();
            const key = displayName;
            data[key] = {
              unit: d.unit || "g",
              calories: Number(d.calories) || 0,
              protein: Number(d.protein) || 0,
              carbs: Number(d.carbs) || 0,
              fat: Number(d.fat) || 0,
              _displayName: displayName,
              _id: doc.id,
            };
          });
          console.debug("[useIngredients] getDocs count:", snapshot.size);
          setIngredients(data);
        } catch (err) {
          console.error("[useIngredients] getDocs error:", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [realtime]);

  return { ingredients, loading, error };
}
