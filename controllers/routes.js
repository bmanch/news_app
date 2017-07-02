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
	Articles.find({ saved: true }).sort({ date: -1 }).exec(function(err, doc) {
    console.log(doc);
    res.render("notes", {doc});
  });
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

router.delete("/delete/:id", function(req, res) {
  Articles.findByIdAndRemove(req.params.id, function(err, doc) {
    if (err) console.log(err);
    // I tried to do this redirect but it wouldn't work for some reason... Any thoughts why?
    // res.redirect(302, "/notes");
    res.json("Article deleted.")
  });
});

router.post("/addnote/:id", function(req, res) {
  var object = req.body;
  console.log(req.body);

  var newNote = new Notes(req.body);

  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      console.log(doc);
      Articles.findByIdAndUpdate(req.params.id, { $push: { notes: doc._id } }, { new: true }, function(err, doc) {
        res.json(doc);
      });
    }
  });
});

router.get("/getnotes/:id", function(req, res) {
  Articles.findOne({ "_id": req.params.id })
  .populate("notes")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

router.delete("/deletenote/:id", function(req, res) {
  Notes.findByIdAndRemove(req.params.id, function(err, doc) {
    if (err) console.log(err);
    res.json("Note deleted.")
  });
});

module.exports = router;