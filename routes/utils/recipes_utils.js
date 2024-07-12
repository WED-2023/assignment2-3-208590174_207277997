const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            // apiKey: process.env.spooncular_apiKey
            apiKey:"3dcd1d731fbc4a55978c3e4e8e3044a4"
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function searchRecipe(recipeName, cuisine, diet, intolerance, number) {
    const response = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: recipeName,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerance,
            number: number,
            apiKey: "3dcd1d731fbc4a55978c3e4e8e3044a4"
        }
    });
    
    // Use Promise.all to fetch details for each recipe ID
    const recipeDetails = await Promise.all(response.data.results.map(element => getRecipeDetails(element.id)));
    return recipeDetails;
}

module.exports={
    getRecipeDetails,
    searchRecipe,
    getRecipeInformation
    };
    

