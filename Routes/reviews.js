const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { reviewSchema} = require("../schema.js");
const {isloggedin,validateReviews,isAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")

//review
router.post("/" ,validateReviews, isloggedin , wrapAsync(reviewController.addReview))

//delete
router.delete("/:reviewId" , isloggedin, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router; 