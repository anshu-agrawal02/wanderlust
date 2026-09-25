const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.addReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const newReview = await new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save();
    console.log("review saved");
    req.flash("success","New review added!!!");
    
    res.redirect(`/listings/${listing._id}`)
};

module.exports.deleteReview = async(req,res)=>{
    const {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleted","review deleted!!!");
    res.redirect(`/listings/${id}`)
};