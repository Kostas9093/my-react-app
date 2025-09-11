// RecipeForm
import React, { useState, useEffect } from 'react'
import IngredientSearch from './IngredientSearch'
import { useIngredients } from './useIngredients'

function RecipeForm({ onSave, initialData }) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [grams, setGrams] = useState('')
  const [ingredientKey, setIngredientKey] = useState(0)
  const { ingredients: ingredientDB, loading } = useIngredients();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setIngredients(initialData.ingredients)
    } else {
      setName('')
      setIngredients([])
    }
  }, [initialData])

  const handleAddIngredient = () => {
    if (!selectedIngredient || !grams) return

    setIngredients(prev => [
      ...prev,
      {
        name: selectedIngredient.name,
        grams: parseFloat(grams),
      },
    ])

    setSelectedIngredient(null)
    setGrams('')
    setIngredientKey(prev => prev + 1) // 🔄 Force IngredientSearch remount
  }

  // ✅ New: delete ingredient
  const handleDeleteIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0 }

    for (let ing of ingredients) {
       const nutri = ingredientDB[ing.name];
      if (!nutri) continue

    let multiplier = 1
      if (nutri.unit === "g") {
      // values are per 100g
      multiplier = ing.grams / 100
    } else if (nutri.unit === "item") {
      // values are per item
      multiplier = ing.grams // here "grams" field actually means "count of items"
    }
    
    total.calories += nutri.calories * multiplier
    total.protein += nutri.protein * multiplier
    total.carbs += nutri.carbs * multiplier
    total.fat += nutri.fat * multiplier
      }
    

    onSave({ name, ingredients, total })
  }

  return (
    <div className="mb-6">
      <input
        className=" items-center"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Recipe Name"
      />

      <div className=" items-center">
        <div className="items-center">
          <IngredientSearch key={ingredientKey} onSelect={setSelectedIngredient} />
        </div>
        <input
          className="gr"
          value={grams}
          type="number"
          onChange={(e) => setGrams(e.target.value)}
          placeholder={selectedIngredient?.unit === "item" ? "Count" : "Grams"}
        />
      </div> 
      <br/> 
       <button
          className="addMeal"
          onClick={handleAddIngredient}
            disabled={loading}
        >
          Add
        </button>

      <ul className="mb-2 list-disc pl-5">
        {ingredients.map((ing, idx) => (
            <li key={idx} className="flex justify-between items-center">
            <span>{ing.grams}
              {ingredientDB[ing.name]?.unit || "g"} of {ing.name}</span>
            {/* ✅ Delete button */}
            <button
              type="button"
              onClick={() => handleDeleteIngredient(idx)}
              className="text-red-500 hover:underline ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Save Recipe
      </button>
    </div>
  )
}

export default RecipeForm
