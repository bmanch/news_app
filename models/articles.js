var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
	title: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	blurb: {
		type: String,
		trim: true,
		required: true
	},
	link: {
		type: String,
		trim: true,
		required: true
	},
	saved: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now
	},
	notes: {
		type: Schema.Types.ObjectId,
		ref: "Notes"
	}
});

var Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;