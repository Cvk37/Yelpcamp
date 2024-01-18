const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors,places } = require('./seedHelper')
mongoose.connect('mongodb://127.0.0.1:27017/Yelp')
.then(()=>{
    console.log("Connection Open")
})
.catch(err =>{
     console.log("Oh No error")
     console.log(err)
})
const sample = array =>  array[Math.floor(Math.random()*array.length)]
const seedDB = async()=>{
   await Campground.deleteMany({});
   for(let i=0;i<200;i++){
   const randcity = sample(cities);
   const price = Math.ceil(Math.random()*30);
   const camps = new Campground({
    author:'6539903aeca77882b9409ff7',
    location:`${randcity.city},${randcity.state}`,
    title:`${sample(descriptors)}  ${sample(places)}`, 
    geometry: {
                type: "Point",
                coordinates: [
                 randcity.longitude,
                 randcity.latitude
                ]
            }, 

      images: [
    {
      url: 'https://res.cloudinary.com/douq9trcw/image/upload/v1705549568/Yelpcamp/ebqy6wgjcitp1xecw4c0.jpg',
      filename: 'Yelpcamp/ebqy6wgjcitp1xecw4c0'
      
    },
    {
      url: 'https://res.cloudinary.com/douq9trcw/image/upload/v1705549569/Yelpcamp/ya9dj92oweivz54wyuag.jpg',
      filename: 'Yelpcamp/ya9dj92oweivz54wyuag'
     
    }
  ],

    description:'egestas quis ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim sit amet venenatis urna cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla ut',
    price : price
})
  await camps.save();
   }
  
}

seedDB().then(()=>{
    mongoose.connection.close();
});