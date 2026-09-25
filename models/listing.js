const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema= new Schema({
    title :{
        type:String,
        required:true
    },
    description :{
        type:String,
    },
    image:{
        filename:{
            type:String,
            default:"new image",

        },
        url:{
            type:String,
            default:"https://www.rockislandhousing.com/media/com_posthousing/images/nophoto.png",
            set :(v)=> v===""? "https://www.rockislandhousing.com/media/com_posthousing/images/nophoto.png": v,
        }
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true
    },
    reviews : [{
        type:Schema.Types.ObjectId,
        ref:"Review"

    }],
    owner :{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category :[{
    type: String,
    enum: [
        "rooms",
        "trending",
        "mountains",
        "iconic city",
        "amazing pool",
        "castles",
        "camping",
        "farming"
    ]
}],
});

listingSchema.post("findOneAndDelete", async (listing) => {
    console.log("Middleware Executed");
    console.log(listing);

    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;