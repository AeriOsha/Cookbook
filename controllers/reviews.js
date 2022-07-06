const Recipe = require('../models/recipe')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    recipe.reviews.push(review);
    await review.save();
    await recipe.save();
    req.flash('success','created new review')
    res.redirect(`/recipes/${recipe._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','deleted review')
    res.redirect(`/recipes/${id}`);
}

