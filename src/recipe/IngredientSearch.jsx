import React, { useState, useEffect } from "react";
import { NUTRITION_DB } from "./NutritionDB.js";


export default function IngredientSearch({ onSelect , resetSignal }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
   useEffect(() => {
   
      setQuery("");        // ✅ clear the input
      setResults([]);      // ✅ clear search results
      setShowResults(false);
    
  }, [resetSignal]);

 const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const matches = Object.keys(NUTRITION_DB)
        .filter((key) => key.toLowerCase().includes(value.toLowerCase()))
        .map((key) => ({
          name: key,
          ...NUTRITION_DB[key],
        }));
      setResults(matches);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.name);      // ✅ Fill search bar
    setShowResults(false);    // ✅ Close dropdown
    onSelect(item);           // ✅ Send selection back to parent
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search ingredient"
        className="border px-2 py-1 rounded w-full"
      />
      {showResults && results.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto shadow">
          {results.map((item, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <strong>{item.name} ({item.unit})</strong> — {item.calories} kcal, P {item.protein}g, C {item.carbs}g, F {item.fat}g
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
