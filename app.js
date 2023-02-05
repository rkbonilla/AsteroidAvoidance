var express = require("express");
var app = express();
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var port = process.env.port || 5000;

var db = require("./config/database")

app.use(express.static(__dirname + "/static"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
}).then(function () {
    console.log("Connected to MongoDB");
}).catch(function (error) {
    console.log(error);
})

require("./models/HiScore");
var HiScore = mongoose.model("highscore");

// Home page
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
})

app.post("/saveScore", function (req, res) {
    console.log(req.body);
    //res.send(req.body);

    new HiScore(req.body).save()
        .then(function () {
            res.redirect("index.html");
        })
})

app.get("/getScore", function (req, res) {
    HiScore.find({})
        //.limit(1)
        .sort('-score')
        .then(function (highscore) {
            //console.log({ highscore });
            res.json({ highscore });
        })
})

app.listen(port, function () {
    console.log(`Running on port ${port}.`)
})