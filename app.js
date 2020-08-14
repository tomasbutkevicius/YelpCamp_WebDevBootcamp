var express    		= require("express");
var app        		= express();
var bodyParser 		= require("body-parser");
var mongoose   		= require("mongoose");
var Campground 		= require("./models/campground.js");
var seedDB     		= require("./seeds.js");
var Comment    		= require("./models/comment.js");
var passport 		= require("passport");
var LocalStrategy   = require("passport-local");
var User       		= require("./models/user");
var methodOverride  = require("method-override");
var flash            = require("connect-flash");

//requring routes
var commentRoutes    = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes      = require("./routes/index.js");
var url              = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";
var port             = process.env.PORT        || 4444;
//seed the database
// seedDB(); 
mongoose.set('useFindAndModify', false);
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Rudis is best cat",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//a constant line below
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(function(req,res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



//netstat -tulpn for linux terminal to list ports or just use sudo lsof -t -i:8080 to get permission and pid and then sudo kill -9 <pid>
//PROD ENV
app.listen(port, process.env.IP, function(){
	console.log("The CatCamp Server Started");
})

//DEV ENV
// app.listen(4444, process.env.IP, function(){
// 	console.log("The YelpCapm Server Started");
// });

