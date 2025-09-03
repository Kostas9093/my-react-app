import React, { useState } from "react";
import { NUTRITION_DB } from "./NutritionDB.js";

export default function IngredientSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (!q) {
      setResults([]);
      return;
    }
    const filtered = Object.keys(NUTRITION_DB).filter((key) =>
      key.toLowerCase().includes(q.toLowerCase())
    );
    setResults(filtered.map((key) => ({ name: key, ...NUTRITION_DB[key] })));
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search ingredient"
        className="border px-2 py-1 rounded w-full"
      />
      <ul className="mt-2 border rounded p-2 bg-gray-50 max-h-40 overflow-y-auto">
        {results.map((food, idx) => (
          <li
            key={idx}
            className="cursor-pointer hover:bg-gray-200 p-1"
            onClick={() => onSelect(food)}
          >
            <strong>{food.name}</strong> — {food.calories} kcal, P {food.protein}g, C {food.carbs}g, F {food.fat}g
          </li>
        ))}
      </ul>
    </div>
  );
}
