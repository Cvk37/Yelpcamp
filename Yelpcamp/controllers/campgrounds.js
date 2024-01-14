const Campground = require('../models/campground');
const { push } = require('../seeds/cities');
module.exports.index= async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.create=async (req,res,next)=>{

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success','Sucessfully saved Campground')
    res.redirect(`/campgrounds/${campground._id}`)
    
}

module.exports.show = async(req,res,next)=>{
   
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error','Cannot find the Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm =  async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
     res.render('campgrounds/edit',{campground})
}

module.exports.edit = async(req,res)=>{
    const {id}=req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    req.flash('success','Sucessfully updated Campground')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.delete = async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('del','Sucessfully deleted Campground')
    res.redirect('/campgrounds');

}