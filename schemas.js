const Joi = require('joi');

module.exports.recipeSchema = Joi.object({
    recipe: Joi.object({
        title: Joi.string().required().min(3),
        
        instructions: Joi.string().required(),
        notes: Joi.string(),
        preptime: Joi.string(),
        cooktime: Joi.string(),
        
    }).required()
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})