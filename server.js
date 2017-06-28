var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var methodOverride = require("method-override");
var path = require("path");
var exphbs = require("express-handlebars");
var routes = require("./controllers/routes.js");
var PORT = process.env.PORT || 3000;
var mongoose = require("mongoose");
mongoose.Promise = Promise;

var app = express();

app.use(express.static(path.join(__dirname + "/public")));

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost/news_scraper");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.use(methodOverride("_method"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", routes);

app.listen(PORT, console.log("Listening on port: " + PORT));