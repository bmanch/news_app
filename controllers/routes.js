var express = require("express");
var router = express.Router();
var Articles = require("../models/articles.js");
var Notes = require("../models/notes.js");
var request = require("request");
var cheerio = require("cheerio");

router.get("/", function(req, res) {
  Articles.find({ saved: false }).limit(15).sort({ date: -1 }).exec(function(err, doc) {
    res.render("home", {doc});
  });
});

router.get("/notes", function(req, res) {
	res.render("notes");
});

router.get("/scrape", function(req, res) {

  request("https://www.washingtonpost.com/", function(error, response, html) {
    var $ = cheerio.load(html);

    $('.headline').each(function(i, element) {
      var result = {};
      if (i === 15) {
        res.redirect(302, "/");
      } else {
        result.title = $(this).children('a').text();
        result.blurb = $(this).next().text();
        result.link = $(this).children('a').attr('href');

        var entry = new Articles(result);
        console.log(entry);
        entry.save(function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        });
      }
    });
  });
});

router.put("/save/:id", function(req, res) {
  console.log(req.params.id);

  Articles.findByIdAndUpdate(req.params.id, { saved: true }, function(err, doc) {
    res.json("The article has been saved to your notebook!");
  });
});

module.exports = router;