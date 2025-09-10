// src/IngredientSearch.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useIngredients } from "./useIngredients";

export default function IngredientSearch({ onSelect, resetSignal }) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { ingredients, loading, error } = useIngredients();

  // Reset input when parent triggers reset
  useEffect(() => {
    setQuery("");
    setShowResults(false);
  }, [resetSignal]);


  
  // Compute results on the fly instead of keeping them in state
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const qLower = q.toLowerCase()
    
    return Object.keys(ingredients)
      .filter((key) => {
        const item = ingredients[key];
        
        return (
          key.toLowerCase().includes(qLower) ||
      (item._displayName && item._displayName.toLowerCase().includes(qLower))
    )
  })
      .map((key) => {
        const item = ingredients[key];
        return {
          name: item._displayName,
          key,
          unit: item.unit,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          _id: item._id,
        };
      });
  }, [query, ingredients]);

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowResults(false);
    onSelect(item); // send entire ingredient object
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          loading
            ? "Loading ingredients..."
            : error
            ? "Error loading ingredients"
            : "Search ingredient"
        }
        className="border px-2 py-1 rounded w-full"
        onFocus={() => setShowResults(true)}
      />

      {showResults && (
        <ul className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto shadow">
          {loading && <li className="p-2">Loading...</li>}
          {!loading && results.length === 0 && (
            <li className="p-2">No results</li>
          )}
          {!loading &&
            results.map((item) => (
              <li
                key={item.key}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                <strong>
                  {item.name} ({item.unit})
                </strong>{" "}
                — {item.calories} kcal, P {item.protein}g, C {item.carbs}g, F{" "}
                {item.fat}g
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
