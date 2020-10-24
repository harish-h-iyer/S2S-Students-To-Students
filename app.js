var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override"),
    flash = require("connect-flash");

var Inventory = require("./models/inventory.js");
var seedDB = require("./seeds.js");
var Comment = require("./models/comment");
var User = require("./models/user");   
var commentRoutes = require("./routes/comments");
var inventoryRoutes = require("./routes/inventorys");
var authRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({ extended: true }));
//app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(methodOverride("_method"));
app.use(flash());
app.use('/images/inventorys', express.static('images/inventorys'));
app.use('/images', express.static('images'))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

mongoose.connect("mongodb://localhost:27017/s2s", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.Types.ObjectId.isValid('"exif.js"')


app.locals.moment = require('moment');


//seedDB(); //seed the database

//passport-config
app.use(require("express-session")({
    secret: "dasda",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use(inventoryRoutes);
app.use(commentRoutes);

app.listen(3020, function(){
    console.log("S2S server has started!");
}); 