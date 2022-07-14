const express = require('express');
const router = express.Router();
const recipes = require('../controllers/recipes')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateRecipe,isAuthor} = require('../middleware')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.get('/new', isLoggedIn, recipes.renderNewForm)

router.route('/')
    .get(catchAsync(recipes.index))
    .post(isLoggedIn,upload.array('image'),catchAsync(recipes.createRecipe))

router.route('/:id')
    .get(catchAsync(recipes.showRecipe))
    .put(isLoggedIn, isAuthor, catchAsync(recipes.updateRecipe))
    .delete(isLoggedIn,isAuthor, catchAsync(recipes.deleteRecipe))


router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(recipes.renderEditForm))

module.exports = router