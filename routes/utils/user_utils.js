const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${username}',${recipe_id})`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where username='${username}'`);
    return recipes_id;
}

// Function to create a new recipe
async function createRecipe(username, title, readyInMinutes, image,summary,instructions, popularity, vegan, vegetarian, glutenFree, ingredients) {
  // Insert the recipe into User_Recipes table
  const result = await DButils.execQuery(`
    INSERT INTO User_Recipes (username, title, readyInMinutes, image, popularity, vegan, vegetarian, glutenFree,summary,instructions)
    VALUES ('${username}', '${title}', ${readyInMinutes}, '${image}', ${popularity}, ${vegan}, ${vegetarian}, ${glutenFree},'${summary}','${instructions}')
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

// Function to retrieve preview of user-created recipes
async function getUserRecipes(username) {
  try {
      const recipes = await DButils.execQuery(`SELECT * FROM User_Recipes WHERE username='${username}'`);
      if (recipes.length === 0) {
          // Handle the case where no recipes are found for the user
          return { error: 'No recipes found for this user.' };
      }
      return recipes;
  } catch (error) {
      console.error('Failed to retrieve recipes:', error);
      return { error: 'Failed to retrieve recipes.' };
  }
}

// Function to retrieve user-created recipes
async function getUserRecipeInformation(username,recipe_id) {
  try {
      const recipe = await DButils.execQuery(`SELECT * FROM User_Recipes WHERE username='${username}' AND recipe_id=${recipe_id}`);
      if (recipe.length === 0) {
          // Handle the case where the recipe does not exist for the user
          return { error: 'Recipe does not exist for this user.' };
      }

      const ingredients = await DButils.execQuery(`SELECT ingredient_name, amount, unit FROM extended_ingredient WHERE recipe_id=${recipe_id}`);
      if (ingredients.length === 0) {
          // Handle the case where there are no ingredients for the given recipe
          recipe[0].ingredients = [];
          return { ...recipe[0], message: 'No ingredients found for this recipe.' };
      }

      // Assigning ingredients to the recipe object
      recipe[0].ingredients = ingredients;
      return recipe[0];
  } catch (error) {
      console.error('Failed to retrieve recipe information:', error);
      return { error: 'Failed to retrieve recipe information.' };
  }
}
  
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.createRecipe = createRecipe;
exports.getUserRecipes = getUserRecipes;
exports.getUserRecipeInformation = getUserRecipeInformation;

