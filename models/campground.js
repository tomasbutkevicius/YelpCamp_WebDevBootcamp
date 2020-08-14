var mongoose   = require("mongoose");
//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	rating: String,
	image: String,
	info: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campgroundSchema);