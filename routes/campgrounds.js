var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware/index.js");

//INDEX - show all campgrounds
router.get("/", function(req,res){
// 	Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index.ejs",{campgrounds:allCampgrounds});
		}
	});
});


//CREATE - add new campground to database
router.post("/", middleware.isLoggedIn, function(req,res){
	//then we install npm install body-parser --save
		 //get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var info= req.body.info;
	var rating = req.body.rating;
	var author = {
		id:  req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, rating: rating, info: info, image: image, author: author};
	
	
	
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
		
	});
		 
});

//NEW - show form to create campground
//this router.get should be declared first, because another
// router.get with /:id will get anything that comes after
// /campgrounds as an id
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new.ejs");
});



//SHOW  - shows more info about one campground
router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){ 
			console.log(err);
		}
		else {
			//render show template with that campground
	res.render("campgrounds/show.ejs", {campground: foundCampground});
		}
	});
})
//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
			Campground.findById(req.params.id, function(err, foundCampground){
				res.render("campgrounds/edit.ejs", {campground: foundCampground});
			});
});
//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;