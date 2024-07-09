const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${username}',${recipe_id})`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where username='${username}'`);
    return recipes_id;
}

async function createUserRecipe(recipe_info){
    await DButils.execQuery(`insert into User_Recipes values ('${recipe_info.username}',${recipe_info.title})',${recipe_info.readyInMinutes}',${recipe_info.image}',${recipe_info.aggregateLikes}',${recipe_info.vegan}',${recipe_info.vegetarian}',${recipe_info.glutenFree}`);
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
