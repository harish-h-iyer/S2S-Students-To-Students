var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Inventory = require("../models/inventory");


router.get("/",function(req, res){
    res.render("landing.ejs");
});

router.get("/register",function(req, res){
    res.render("register.ejs");
});

router.post("/register", function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneno: req.body.phoneno,
            upiId: req.body.upiId,
            studyin: req.body.studyin,
            batch: req.body.batch,
            hostel: req.body.hostel
        });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
         req.flash("error", err.message);
         return res.render("register.ejs");   
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to S2S " + user.username);
            res.redirect("/inventorys");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login.ejs");
});
            
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/inventorys",
        failureRedirect:"/login"
    }),function(req, res){
});

router.get("/logout",function(req, res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/inventorys");
});

router.get("/users/:id",isLoggedIn,function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect("/inventorys");
        }
        Inventory.find().where('author.id').equals(foundUser._id).exec(function(err, inventorys){
            if(err) {
                req.flash("error", "Something went wrong");
                res.redirect("/inventorys");
            }
            res.render("users/show.ejs",{user : foundUser, inventorys: inventorys});
        }); 
    });
});

router.get("/currentUser/:id",isLoggedIn,function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/inventorys");
        }
        Inventory.find().where('author.id').equals(foundUser._id).exec(function(err, inventorys){
            if(err) {
                req.flash("error", "Something went wrong");
                res.redirect("/inventorys");
            }
        res.render("users/currentUser.ejs",{user : foundUser, inventorys: inventorys});
    });
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;