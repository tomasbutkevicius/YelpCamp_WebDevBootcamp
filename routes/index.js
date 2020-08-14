var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user.js")

//Root route
router.get("/", function(req,res){
	res.render("landing.ejs")
});
//========
// AUTH ROUTES
// =========

//show register form
router.get("/register", function(req,res){
	res.render("register.ejs");
})

//handle sign up logic
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			res.redirect("/register");
		} else {
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to CatCamp, " + user.username);
			res.redirect("/campgrounds");
		});
		}
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login.ejs");
})

//Login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds", 
	failureRedirect: "/login",
	failureFlash : true
	}), function(req,res){
});

//logout route
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");	
});

module.exports = router;