const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CampgroundSchema = new Schema({
    title : String,
    price : Number,
    image : String,
    description : String,
    location : String,
    reviews:[{
     type:Schema.Types.ObjectId,
     ref:'Review'
    }]
});

CampgroundSchema.post('findOneandDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in : doc.reviews
            }
        })
    }
})
module.exports= mongoose.model('Camp',CampgroundSchema);