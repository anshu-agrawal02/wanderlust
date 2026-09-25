const Listing = require("../models/listing")

module.exports.index = async(req,res)=>{
    const { category } = req.query;

    let allListing;

    if(category){
        allListing = await Listing.find({
            category: category
        });
    } else {
        allListing = await Listing.find({});
    }

    res.render("listings/index.ejs",{allListing});
}   

module.exports.renderNewForn = (req,res)=>{
    res.render("listings/newprop.ejs");
}

module.exports.showList = async(req,res)=>{
    let {id} = req.params;
    const listing  = await Listing.findById(id).populate({path: "reviews", populate: {path:"author"} }).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createList = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing= await new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={filename, url};
    await newListing.save();
    console.log("added new prop");
    req.flash("success","New Listing Created!!!");
    res.redirect("/listings");
    
};

module.exports.editList = async (req,res)=>{
    const {id} = req.params;    
    const listing  = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload" , "/upload/w_250");
    
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateList = async(req,res)=>{
    const {id} = req.params;
    
    const listing  = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image ={filename, url};
        await listing.save();
    }
    
    req.flash("success","Listing Updated!!!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteList = async(req,res)=>{
    const {id} = req.params;
    const listing  = await Listing.findByIdAndDelete(id);
    req.flash("deleted","listing deleted");
    res.redirect("/listings")
};