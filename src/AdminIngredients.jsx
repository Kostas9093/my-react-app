// AdminIngredients.jsx
import React, { useState, useEffect } from "react";
import { db } from "./recipe/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useParams, useNavigate } from 'react-router-dom';


export default function AdminIngredients() {
  const [form, setForm] = useState({
    name: "",
    unit: "g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const [ingredients, setIngredients] = useState([]);
    const navigate = useNavigate();

  // Fetch ingredients in real-time
  useEffect(() => {
    const q = query(collection(db, "ingredients"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIngredients(data);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  if (!form.name) {
    alert("Name is required!");
    return;
  }
  
  try {
    const ingredientRef = doc(db, "ingredients", form.name); // use name as ID
    await setDoc(ingredientRef, {
      name: form.name,   
      unit: form.unit,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
    });
    // alert("Ingredient added!");
    setForm({ name: "", unit: "g", calories: "", protein: "", carbs: "", fat: "" });
  } catch (err) {
    console.error(err);
    // alert("Failed to add ingredient.");
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete ingredient "${id}"?`)) return;

    try {
      await deleteDoc(doc(db, "ingredients", id));
      alert("Ingredient deleted!");
     
    } catch (err) {
      console.error(err);
      alert("Failed to delete ingredient.");
    }
  };
  return (
    <div className="p-4">
       <button onClick={() => navigate('/')} className="mb-4 text-blue-500 hover:underline">
        ← Back
      </button>
      <h2 className="text-lg font-bold mb-4">Add Ingredient</h2>

      {["name", "unit", "calories", "protein", "carbs", "fat"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
          className="border p-2 mb-2 block"
        />
      ))}

      <button className="bg-blue-500 text-white px-4 py-2 mb-4" onClick={handleSubmit}>
        Save Ingredient
      </button>

      <h3 className="text-md font-bold mt-6 mb-2">Existing Ingredients</h3>
      {ingredients.length === 0 ? (
        <p>No ingredients found.</p>
      ) : (
        <ul className="list-disc ml-6">
          {ingredients.map((ing) => (
            <li key={ing.id}>
              {ing.name} — {ing.calories} cal / {ing.protein}g protein / {ing.carbs}g carbs / {ing.fat}g fat ({ing.unit})
                 <button
              className="bg-red-500 text-white px-2 py-1"
              onClick={() => handleDelete(ing.id)}
            >
              Delete
            </button>
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
}
