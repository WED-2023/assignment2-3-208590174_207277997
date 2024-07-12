const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${username}',${recipe_id})`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where username='${username}'`);
    return recipes_id;
}

// Function to create a new recipe
async function createRecipe(username, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree, ingredients) {
  // Insert the recipe into User_Recipes table
  const result = await DButils.execQuery(`
    INSERT INTO User_Recipes (username, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree)
    VALUES ('${username}', '${title}', ${readyInMinutes}, '${image}', ${popularity}, ${vegan}, ${vegetarian}, ${glutenFree})
  `);
  const recipe_id = result.insertId;

  // Insert ingredients into extended_ingredient table
  for (let ingredient of ingredients) {
    await DButils.execQuery(`
      INSERT INTO extended_ingredient (recipe_id, username, ingredient_name, amount, unit)
      VALUES (${recipe_id}, '${username}', '${ingredient.name}', ${ingredient.amount}, '${ingredient.unit}')
    `);
  }

  return recipe_id;
}

// Function to retrieve user-created recipes
async function getUserRecipes(username) {
    const recipes = await DButils.execQuery(`SELECT * FROM User_Recipes WHERE username='${username}'`);
  
    for (let recipe of recipes) {
      const ingredients = await DButils.execQuery(`SELECT ingredient_name, amount, unit FROM extended_ingredient WHERE recipe_id=${recipe.recipe_id}`);
      recipe.ingredients = ingredients;
    }
  
    return recipes;
  }
  
  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.createRecipe = createRecipe;
exports.getUserRecipes = getUserRecipes;

