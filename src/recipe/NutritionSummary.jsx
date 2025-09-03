import React from 'react'

function NutritionSummary({ recipe, portions }) {
  const portion = portions || 1
  const perPortion = {
    calories: recipe.total.calories / portion,
    protein: recipe.total.protein / portion,
    carbs: recipe.total.carbs / portion,
    fat: recipe.total.fat / portion,
  }

  return (
    <div className="mt-4 p-4 border rounded bg-gray-100">
      <h3 className="font-bold mb-2 text-lg">Nutrition Summary</h3>

      <div className="mb-2">
        <p className="font-semibold">Total (whole recipe):</p>
        <ul className="list-disc pl-5 text-sm">
          <li>Calories: {recipe.total.calories.toFixed(1)}</li>
          <li>Protein: {recipe.total.protein.toFixed(1)}g</li>
          <li>Carbs: {recipe.total.carbs.toFixed(1)}g</li>
          <li>Fat: {recipe.total.fat.toFixed(1)}g</li>
        </ul>
      </div>

      <div className="mb-2">
        <p className="font-semibold">Per Portion (÷ {portion}):</p>
        <ul className="list-disc pl-5 text-sm">
          <li>Calories: {perPortion.calories.toFixed(1)}</li>
          <li>Protein: {perPortion.protein.toFixed(1)}g</li>
          <li>Carbs: {perPortion.carbs.toFixed(1)}g</li>
          <li>Fat: {perPortion.fat.toFixed(1)}g</li>
        </ul>
      </div>

      {recipe.ingredients?.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold">Ingredients:</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>
                {ing.grams}g of {ing.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NutritionSummary
