const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    try {
      // Trim any whitespace or newline characters from the recipe_id
      const cleanedRecipeId = recipe_id.trim();
      const response = await axios.get(`${api_domain}/${cleanedRecipeId}/information`, {
        params: {
          includeNutrition: false,
          apiKey:"dfae693cae89440ab9807ae88961373f"
        }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw { status: 404, message: "No results were found" };
      } else {
        throw error;
      }
    }
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
            apiKey: "dfae693cae89440ab9807ae88961373f"
        }
    });
    
    // Use Promise.all to fetch details for each recipe ID
    const recipeDetails = await Promise.all(response.data.results.map(element => getRecipeDetails(element.id)));
    return recipeDetails;

    //return getRecipeDetails(response.data.results.map((element) => element.recipe_id));
}


module.exports={
    getRecipeDetails,
    searchRecipe,
    getRecipeInformation
    };
    

