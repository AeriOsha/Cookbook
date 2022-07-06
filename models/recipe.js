const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: String,
    images: [
        {url: String,filename: String}
    ],
    ingredients: Array,
    instructions: String,
    notes:String,
    preptime: String,
    cooktime:String,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

RecipeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Recipe', RecipeSchema);