const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const User = require("../models/users.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const {isloggedin, isOwner,validateListing,validateReviews} = require("../middleware.js")
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage })



//show all listing 

router
    .route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isloggedin ,upload.single('listing[image][url]'), validateListing, wrapAsync(listingcontroller.createList));

//new list 
router.get("/new",isloggedin, listingcontroller.renderNewForn)

router
    .route("/:id")
    .get(wrapAsync(listingcontroller.showList))
    .put( validateListing ,isloggedin , isOwner ,upload.single('listing[image][url]'),  wrapAsync(listingcontroller.updateList))
    .delete( isloggedin, isOwner ,  wrapAsync(listingcontroller.deleteList));






//edit
router.get("/:id/edit" ,isloggedin , isOwner ,  wrapAsync(listingcontroller.editList));


module.exports=router; 