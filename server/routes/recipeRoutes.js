//step9 include express
const express=require('express');
const router=express.Router();//to be able to use router
//step10 create a file recipeController.js inside controllers and include this in recipeRoutes.js
const recipeController=require('../controllers/recipeController');
//step11 to be able to use route we will export module.exports=router;
//step12 creating app routes
const path = require('path');
router.get('/',recipeController.homepage);//homepage is just name of a page
router.get('/categories',recipeController.exploreCategories)//step 13 creating this controller homepage
router.get('/recipe/:id',recipeController.exploreRecipe);//recipe page
router.get('/categories/:id',recipeController.exploreCategoriesById);
router.post('/search',recipeController.searchRecipe);
router.get('/explore-latest',recipeController.exploreLatest);//for explore latest button
router.get('/explore-random',recipeController.exploreRandom);
router.get('/submit-recipe',recipeController.submitRecipe);
router.post('/submit-recipe',recipeController.submitRecipeOnPost);
router.get('/contact', function(req, res) {
  res.sendFile(path.join(__dirname, '../../views/contact.html'));
});


module.exports=router;
