// RecipeApp.jsx
import React, { useState } from 'react'
import RecipeForm from './RecipeForm'
import NutritionSummary from './NutritionSummary'
import PortionControl from './PortionControl'
import { loadRecipes, saveRecipe } from './LocalStorageUtils'
import { Link } from "react-router-dom";

function RecipeApp() {
  const [recipes, setRecipes] = useState(loadRecipes())
  const [currentRecipe, setCurrentRecipe] = useState(null)
  const [portionCount, setPortionCount] = useState(1)
  const [view, setView] = useState('list') // 'list' | 'details' | 'form'

  // ✅ Save recipe with portions
  const handleSave = (recipe) => {
    const recipeWithPortions = { ...recipe, portions: portionCount } 
    const updatedRecipes = [
      ...recipes.filter(r => r.name !== recipe.name),
      recipeWithPortions
    ]
    setRecipes(updatedRecipes)
    saveRecipe(updatedRecipes)
    setCurrentRecipe(recipeWithPortions)
    setView('details')
  }

  // ✅ Edit existing recipe
  const handleEdit = (name) => {
    const recipe = recipes.find(r => r.name === name)
    setCurrentRecipe(recipe)
    setPortionCount(recipe?.portions || 1) // 👈 restore saved portions
    setView('form')
  }

  // ✅ View details of recipe
  const handleViewDetails = (name) => {
    const recipe = recipes.find(r => r.name === name)
    setCurrentRecipe(recipe)
    setPortionCount(recipe?.portions || 1) // 👈 restore saved portions
    setView('details')
  }

  // ✅ Delete recipe
  const handleDelete = (name) => {
    const updatedRecipes = recipes.filter(r => r.name !== name)
    setRecipes(updatedRecipes)
    saveRecipe(updatedRecipes)
    setCurrentRecipe(null)
    setView('list')
  }

  // ✅ Persist portions whenever user changes the dropdown
  const handlePortionsChange = (p) => {
    setPortionCount(p)

    if (!currentRecipe) return

    const updated = { ...currentRecipe, portions: p }
    setCurrentRecipe(updated)

    const updatedRecipes = recipes.map(r =>
      r.name === updated.name ? updated : r
    )
    setRecipes(updatedRecipes)
    saveRecipe(updatedRecipes)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
     

      {view === 'list' && (
        <><div className="mt-4">
        <Link to="/" className="bg-red-500 text-white px-4 py-2 rounded">
          Exit to Home
        </Link>
      </div>
       <h1 className="text-2xl font-bold mb-4">Add a recipe</h1>
          <button className="mb-4 bg-green-500 text-white px-4 py-2" onClick={() => {
             setCurrentRecipe(null); 
              setPortionCount(1) // reset
            setView('form') }}>
              Add New Recipe
              </button>
              
          <h2 className="text-lg font-semibold">My recipes</h2>
          <ul className="list-disc pl-5">
            {recipes.map(r => (
              <li
                key={r.name}
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleViewDetails(r.name)}
              >
                {r.name}
              </li>
            ))}
          </ul>
        </>
      )}

      {view === 'form' && (
        <RecipeForm onSave={handleSave} initialData={currentRecipe} />
      )}

      {view === 'details' && currentRecipe && (
        <>
          <PortionControl portionCount={portionCount}  setPortionCount={handlePortionsChange}  />
          <NutritionSummary recipe={currentRecipe} portions={portionCount} />
          <div className="mt-4 flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2" onClick={() => handleEdit(currentRecipe.name)}>Edit</button>
            <button className="bg-red-600 text-white px-4 py-2" onClick={() => handleDelete(currentRecipe.name)}>Delete</button>
            <button className="bg-gray-400 text-white px-4 py-2" onClick={() => setView('list')}>Back</button>
          </div>
        </>
      )}
       {/* <div className="mt-4">
        <Link to="/" className="bg-red-500 text-white px-4 py-2 rounded">
          Exit to Home
        </Link>
      </div> */}
    </div>
    
  )
}

export default RecipeApp;