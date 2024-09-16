var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path is for searching a recipe
 */
router.get("/search", async (req, res, next) => {
  try {
    const recipeName = req.query.recipeName;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerance = req.query.intolerance;
    const number = req.query.number || 5;
    const results = await recipes_utils.searchRecipe(recipeName, cuisine, diet, intolerance, number);
    res.send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns preview details of a recipe by its id
 */
router.get("preview/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full view of a recipe by its id
 */
router.get("/fullview/:recipeId", async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId.trim(); 
    const recipe = await recipes_utils.getRecipeInformation(recipeId);
    console.log(recipe)
    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns 3 random recipes
 */
router.get("/random", async (req, res, next) => {
  try {
    var recipeDetails;
    const recipes = await recipes_utils.getRandomRecipes(3);
    const recipeIds = recipes.map(recipe => (String(recipe.id)));
    var recipesDetailsArray = [];
    // Loop through each recipe ID
    for (let recipeId of recipeIds) 
      {
      try {
        recipeDetails = await recipes_utils.getRecipeDetails(recipeId);
        recipesDetailsArray.push(recipeDetails); // Add recipe details to the array
       } 
      catch (error) {
        console.error(`Error fetching details for recipe ID ${recipeId}:`, error);
      }
      }
    res.status(200).send(recipesDetailsArray);
  }
   catch (error) {
    next(error);
  }
});


module.exports = router;
