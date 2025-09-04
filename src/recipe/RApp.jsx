// Recipe app.jsx
import React, { useState } from 'react'
import RecipeForm from './RecipeForm'
import NutritionSummary from './NutritionSummary'
import PortionControl from './PortionControl'
import { loadRecipes, saveRecipe } from './LocalStorageUtils'
import './recipe.module.css';
import { Link } from "react-router-dom";



function RecipeApp() {
  const [recipes, setRecipes] = useState(loadRecipes())
  const [currentRecipe, setCurrentRecipe] = useState(null)
  const [portionCount, setPortionCount] = useState(1)
  const [view, setView] = useState('list') // 'list' | 'details' | 'form'

  const handleSave = (recipe) => {
    const updatedRecipes = [...recipes.filter(r => r.name !== recipe.name), recipe]
    setRecipes(updatedRecipes)
    saveRecipe(updatedRecipes)
    setCurrentRecipe(recipe)
    setView('details')
  }

  const handleEdit = (name) => {
    const recipe = recipes.find(r => r.name === name)
    setCurrentRecipe(recipe)
    setView('form')
  }

  const handleViewDetails = (name) => {
    const recipe = recipes.find(r => r.name === name)
    setCurrentRecipe(recipe)
    setView('details')
  }


  const handleDelete = (name) => {
    const updatedRecipes = recipes.filter(r => r.name !== name)
    setRecipes(updatedRecipes)
    saveRecipe(updatedRecipes)
    setCurrentRecipe(null)
    setView('list')
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add a recipe</h1>

      {view === 'list' && (
        <>
          <button className="mb-4 bg-green-500 text-white px-4 py-2" onClick={() => { setCurrentRecipe(null); setView('form') }}>Add New Recipe</button>
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
          <PortionControl portionCount={portionCount} setPortionCount={setPortionCount} />
          <NutritionSummary recipe={currentRecipe} portions={portionCount} />
          <div className="mt-4 flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2" onClick={() => handleEdit(currentRecipe.name)}>Edit</button>
            <button className="bg-red-600 text-white px-4 py-2" onClick={() => handleDelete(currentRecipe.name)}>Delete</button>
            <button className="bg-gray-400 text-white px-4 py-2" onClick={() => setView('list')}>Back</button>
          </div>
        </>
      )}
       <div className="mt-4">
        <Link to="/" className="bg-red-500 text-white px-4 py-2 rounded">
          Exit to Home
        </Link>
      </div>
    </div>
    
  )
}

export default RecipeApp;