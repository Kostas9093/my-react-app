import React, { useState } from "react";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./recipe/firebase";

export default function AdminPage() {
  const [id, setId] = useState("");
  const [unit, setUnit] = useState("g");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return alert("Ingredient name required!");

    await setDoc(doc(db, "ingredients", id), {
      unit,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
    });

    alert("Ingredient added!");
    setId("");
    setUnit("g");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">EEEEEEEEEE Add Ingredient</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Ingredient name" className="border p-2 rounded"/>
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="border p-2 rounded">
          <option value="g">grams (g)</option>
          <option value="item">item</option>
        </select>
        <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Calories per unit" className="border p-2 rounded"/>
        <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="Protein (g)" className="border p-2 rounded"/>
        <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Carbs (g)" className="border p-2 rounded"/>
        <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Fat (g)" className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add</button>
      </form>
    </div>
  );
}
