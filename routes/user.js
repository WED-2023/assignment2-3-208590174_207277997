var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/** all paths begin with /users/   */

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(username,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(username);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    //const results = await recipe_utils.getRecipeDetails(recipes_id_array);
    const results = await Promise.all(
      recipes_id_array.map((id) => recipe_utils.getRecipeDetails(id))
    );

    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path allows a logged-in user to create a new recipe
 */
router.post('/createRecipes', async (req, res, next) => {
  try {
    const username = req.session.username;
    const { title, readyInMinutes, image,summary,instructions, popularity, vegan, vegetarian, glutenFree, ingredients } = req.body;

    // Validate input
    if (!title || !readyInMinutes || summary.length === 0 || instructions.length === 0 || !ingredients) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // Create the recipe
    const recipe_id = await user_utils.createRecipe(username, title, readyInMinutes, image, summary,instructions,popularity, vegan, vegetarian, glutenFree, ingredients,);

    res.status(201).send({ message: "Recipe created successfully", recipe_id: recipe_id });
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns the recipes created by the logged-in user
 */
router.get('/myRecipes', async (req, res, next) => {
  try {
    const username = req.session.username;
    const recipes = await user_utils.getUserRecipes(username);
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full view of a user's recipe by its id
 */
router.get("/fullview/:recipeId", async (req, res, next) => {
  try {
    const username = req.session.username;
    const usernameRecipeId = req.params.recipeId.trim(); 
    const userRecipe = await user_utils.getUserRecipeInformation(username,usernameRecipeId);
    res.status(200).send(userRecipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
