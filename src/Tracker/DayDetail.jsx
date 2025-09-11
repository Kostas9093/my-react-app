// DayDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calculateMaintenance } from './utils';
import IngredientSearch from '../recipe/IngredientSearch';
import { NUTRITION_DB } from '../recipe/NutritionDB.js';


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DayDetail() {
  const { dayName } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('calorieData');
    return stored ? JSON.parse(stored) : {};
  });

  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const [editIndex, setEditIndex] = useState(null);
  const [editMeal, setEditMeal] = useState({});

  // IngredientSearch states
  const [foodQuery, setFoodQuery] = useState(null);
  const [foodAmount, setFoodAmount] = useState('');

    // NEW: list of pending ingredients (each: { food, amount })
  const [pendingFoods, setPendingFoods] = useState([]);

  // Saved recipes
  const [savedRecipes, setSavedRecipes] = useState([]);

  const [resetSearch, setResetSearch] = useState(false);


  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const mapped = storedRecipes.map(r => ({
    name: r.name,
    portions: r.portions || 1, // 👈 default to 1 if missing
    totalCalories: r.total?.calories ?? 0,
    totalProtein: r.total?.protein ?? 0,
    totalCarbs: r.total?.carbs ?? 0,
    totalFat: r.total?.fat ?? 0,
    }));
    setSavedRecipes(mapped);
  }, []);

  const meals = data[dayName]?.meals || [];

  const addMeal = (meal) => {
    const updatedMeals = [...meals, meal];
    const userRaw = localStorage.getItem('userInfo');
    const user = userRaw ? JSON.parse(userRaw) : null;

    const updatedDay = {
      meals: updatedMeals,
      total: updatedMeals.reduce((sum, m) => sum + m.calories, 0),
      maintenance: user ? calculateMaintenance(user) : null,
    };

    const updatedData = { ...data, [dayName]: updatedDay };
    setData(updatedData);
    localStorage.setItem('calorieData', JSON.stringify(updatedData));

    setMealName('');
    setMealCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const deleteMeal = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    const updatedDay = {
      meals: updatedMeals,
      total: updatedMeals.reduce((sum, m) => sum + m.calories, 0),
    };
    const updatedData = { ...data, [dayName]: updatedDay };
    setData(updatedData);
    localStorage.setItem('calorieData', JSON.stringify(updatedData));
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditMeal(meals[index]);
  };

  const handleEditChange = (key, value) => {
    setEditMeal((prev) => ({ ...prev, [key]: value }));
  };

  const saveEditedMeal = () => {
    const updatedMeals = [...meals];
    updatedMeals[editIndex] = {
      ...editMeal,
      calories: parseInt(editMeal.calories),
      protein: parseFloat(editMeal.protein || 0),
      carbs: parseFloat(editMeal.carbs || 0),
      fat: parseFloat(editMeal.fat || 0),
    };

    const userRaw = localStorage.getItem('userInfo');
    const user = userRaw ? JSON.parse(userRaw) : null;

    const updatedDay = {
      meals: updatedMeals,
      total: updatedMeals.reduce((sum, m) => sum + m.calories, 0),
      maintenance: user ? calculateMaintenance(user) : null,
    };

    const updatedData = { ...data, [dayName]: updatedDay };
    setData(updatedData);
    localStorage.setItem('calorieData', JSON.stringify(updatedData));
    setEditIndex(null);
    setEditMeal({});
  };

  // Manual meal addition
  const handleAddManualMeal = () => {
    if (!mealName || !mealCalories) return;
    const newMeal = {
      name: mealName,
      calories: parseInt(mealCalories),
      protein: parseFloat(protein || 0),
      carbs: parseFloat(carbs || 0),
      fat: parseFloat(fat || 0),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    addMeal(newMeal);
  };

  // Add the currently selected ingredient to the pending list (does NOT create a meal yet)
const addPendingFood = () => {
  if (!foodQuery || !foodAmount) return;

  setPendingFoods(prev => [
    ...prev,
    { food: foodQuery, amount: parseFloat(foodAmount) || 0 }
  ]);

  // reset inputs
  setFoodQuery(null);
  setFoodAmount('');
  setResetSearch(prev => !prev);
};

// Remove a single pending ingredient by index
const removePendingFood = (index) => {
  setPendingFoods(prev => prev.filter((_, i) => i !== index));
};

// Confirm all pending ingredients: convert each to a meal and add it
const confirmPendingFoods = () => {
  if (!pendingFoods || pendingFoods.length === 0) return;

   const summed = pendingFoods.reduce(
    (acc, { food, amount }) => {
      const nutri = food;
      let multiplier = nutri.unit === 'g' ? amount / 100 : amount;
      acc.calories += (nutri.calories || 0) * multiplier;
      acc.protein  += (nutri.protein  || 0) * multiplier;
      acc.carbs    += (nutri.carbs    || 0) * multiplier;
      acc.fat      += (nutri.fat      || 0) * multiplier;
      acc.names.push(`${amount}${nutri.unit} ${nutri.name}`);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, names: [] }
  );

  const combinedMeal = {
    name: summed.names.join(' + '),
    calories: summed.calories,
    protein: summed.protein,
    carbs: summed.carbs,
    fat: summed.fat,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  addMeal(combinedMeal);
  setPendingFoods([]);
};

  const totalMacros = meals.reduce(
    (totals, m) => {
      totals.protein += m.protein || 0;
      totals.carbs += m.carbs || 0;
      totals.fat += m.fat || 0;
      return totals;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const macroTotal = totalMacros.protein + totalMacros.carbs + totalMacros.fat;
  const macroPercentages =
    macroTotal > 0
      ? [
          { name: 'Protein', value: Math.round((totalMacros.protein / macroTotal) * 100) },
          { name: 'Carbs', value: Math.round((totalMacros.carbs / macroTotal) * 100) },
          { name: 'Fat', value: Math.round((totalMacros.fat / macroTotal) * 100) },
        ]
      : [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  const readableDate = new Date(dayName).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-4 text-blue-500 hover:underline">
        ← Back
      </button>
      <h2 className="text-xl font-bold mb-2">{readableDate}</h2>

      {meals.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-700">
            <strong>Daily Totals:</strong>
            <br />
            Calories: {data[dayName].total.toFixed(0)} kcal
            <br />
            Protein: {totalMacros.protein.toFixed(1)} g, Carbs: {totalMacros.carbs.toFixed(1)} g, Fat: {totalMacros.fat.toFixed(1)} g
          </div>

          <div className="mb-4" style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroPercentages}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ value }) => `${value}%`}
                >
                  {macroPercentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <ul className="mb-4">
        {meals.map((meal, index) => (
          <li key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              {editIndex === index ? (
                <div className="text-gray-500 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Meal name"
                    value={editMeal.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="number"
                    placeholder="Calories"
                    value={editMeal.calories}
                    onChange={(e) => handleEditChange('calories', e.target.value)}
                    className="cal"
                  />
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="Protein"
                      value={editMeal.protein || ''}
                      onChange={(e) => handleEditChange('protein', e.target.value)}
                      className="Nutr"
                    />
                    <input
                      type="number"
                      placeholder="Carbs"
                      value={editMeal.carbs || ''}
                      onChange={(e) => handleEditChange('carbs', e.target.value)}
                      className="Nutr"
                    />
                    <input
                      type="number"
                      placeholder="Fat"
                      value={editMeal.fat || ''}
                      onChange={(e) => handleEditChange('fat', e.target.value)}
                      className="Nutr"
                    />
                  </div>
                  <div className="mt-1">
                    <button onClick={saveEditedMeal} className="but">Save</button>{' '}
                    <button onClick={() => setEditIndex(null)} className="but">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <span onClick={() => handleEditClick(index)} className="cursor-pointer">
                    <strong>{meal.name}</strong>: {meal.calories.toFixed(0)} kcal (per portion)
                    <span className="text-gray-500 text-sm"> ({meal.time})</span>
                    <br />
                    {meal.protein !== undefined && (
                      <span className="text-sm text-gray-600">
                        Protein: {meal.protein.toFixed(1)}g, Carbs: {meal.carbs.toFixed(1) || 0}g, Fat: {meal.fat.toFixed(1) || 0}g
                      </span>
                    )}
                  </span>
                  <button onClick={() => deleteMeal(index)} className="but">Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
        {meals.length === 0 && <li className="text-gray-500">No meals logged.</li>}
      </ul>

 
<br/>
{/* Search from NutritionDB — now supports adding multiple ingredients to a pending list */}
<h3>Add ingredients</h3>
<div className="mb-4">
  <div className="flex items-center gap-2">
    <div className="flex-1">
      <IngredientSearch onSelect={setFoodQuery} resetSignal={resetSearch} />
    </div>

    <input
      type="number"
      value={foodAmount}
      onChange={(e) => setFoodAmount(e.target.value)}
      className="gr"
      placeholder={foodQuery?.unit === "item" ? "count" : "gr"}
    />

    <button onClick={addPendingFood} className="addMeal">Add</button>
  </div>

  {pendingFoods.length > 0 && (
    <div className="mt-3">
      <h4 className="font-semibold">Pending ingredients</h4>
      <ul className="list-disc pl-5 text-sm">
        {pendingFoods.map((p, i) => (
          <li key={i} className="flex justify-between items-center">
            <span>{p.amount}{p.food.unit} {p.food.name}</span>
            <div className="flex gap-2">
              <button onClick={() => removePendingFood(i)} className="remove">Remove</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex gap-2">
        <button onClick={confirmPendingFoods} className="but">Confirm all</button>
        <button onClick={() => setPendingFoods([])} className="but">Clear</button>
      </div>
    </div>
  )}
</div>

      {/* Saved Recipes */}
      <div className="mt-6">
          <div className="mt-6">
  <h3 className="font-bold mb-2">Add a saved recipe</h3>
  {savedRecipes.length === 0 ? (
    <p className="text-gray-500 text-sm">No saved recipes yet.</p>
  ) : (
    <select
      className="border rounded p-2 w-full bg-gray-50"
      defaultValue=""
      onChange={(e) => {
  const selected = savedRecipes[e.target.value];
  if (!selected) return;

  const portions = selected.portions || 1; // fallback for older items

  const newMeal = {
    name: `${selected.name}`,
    calories: (selected.totalCalories || 0) / portions,
    protein:  (selected.totalProtein  || 0) / portions,
    carbs:    (selected.totalCarbs    || 0) / portions,
    fat:      (selected.totalFat      || 0) / portions,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  addMeal(newMeal);
  e.target.value = "";
}}
    >
      <option value="" disabled>
        Select a recipe to add
      </option>
      {savedRecipes.map((recipe, idx) => {
  const portions = recipe.portions || 1;
  const perPortionCalories = (recipe.totalCalories || 0) / portions;

  return (
    <option key={idx} value={idx}>
      {recipe.name} — {perPortionCalories.toFixed(0)} kcal per portion
    </option>
  );
})}
    </select>
  )}
</div>
          {/* Manual meal entry */}
     <h3>Add meal and nutr info</h3>
<div className="text-gray-500">
  <div className="flex flex-col gap-2">
    <input
      type="text"
      placeholder="Meal name"
      value={mealName}
      onChange={(e) => setMealName(e.target.value)}
      className="border px-2 py-1 rounded w-full"
    />
    <input
      type="number"
      placeholder="Calories"
      value={mealCalories}
      onChange={(e) => setMealCalories(e.target.value)}
      className="cal"
    />
  </div>
  <br />
  <div className="flex flex-col gap-2">
    <input
      type="number"
      placeholder="Protein"
      value={protein}
      onChange={(e) => setProtein(e.target.value)}
      className="Nutr"
    />
    <input
      type="number"
      placeholder="Carbs"
      value={carbs}
      onChange={(e) => setCarbs(e.target.value)}
      className="Nutr"
    />
    <input
      type="number"
      placeholder="Fat"
      value={fat}
      onChange={(e) => setFat(e.target.value)}
      className="Nutr"
    />
    <button onClick={handleAddManualMeal} className="addMeal">
      Add
    </button>
    {/* <button
      onClick={() => {
        setMealName('');
        setMealCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
      }}
      className="addMeal"
    >
      Cancel
    </button> */}
  </div>
</div>
      </div>
    </div>
    
  );
  
}
