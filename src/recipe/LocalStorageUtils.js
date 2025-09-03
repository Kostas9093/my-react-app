export const loadRecipes = () => {
  const raw = localStorage.getItem('recipes')
  return raw ? JSON.parse(raw) : []
}

export const saveRecipe = (recipes) => {
  localStorage.setItem('recipes', JSON.stringify(recipes))
}