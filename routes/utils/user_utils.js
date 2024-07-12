const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${username}',${recipe_id})`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where username='${username}'`);
    return recipes_id;
}

// async function createUserRecipe(recipe_info){
//     await DButils.execQuery(`insert into User_Recipes values ('${recipe_info.username}',${recipe_info.title})',${recipe_info.readyInMinutes}',${recipe_info.image}',${recipe_info.aggregateLikes}',${recipe_info.vegan}',${recipe_info.vegetarian}',${recipe_info.glutenFree},${recipe_info.summary},${recipe_info.instructions}`);
//     // const result = await DButils.execQuery(`SELECT COUNT(*) AS count FROM User_Recipes`);
//     // const recipe_id = result[0].count;
//     // for (let i = 0; i < extendedIngredients.length; i++)
//     // {
//     //     var ingredient_id=extendedIngredients[i]['id']
//     //     var ingredient_amount=extendedIngredients[i]['id']
//     //     var ingredient_unit=extendedIngredients[i]['id']
//     //     await DButils.execQuery(`insert into userrecipes_indregdients values ('${username}','${recipe_id}','${ingredient_id}','${ingredient_amount}','${ingredient_unit}')`)
//     // }
// }


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
// exports.createUserRecipe = createUserRecipe;