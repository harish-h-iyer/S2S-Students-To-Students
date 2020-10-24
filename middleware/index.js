var express = require("express");
var router = express.Router();
var Inventory = require("../models/inventory");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkInventoryOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        
        Inventory.findById(req.params.id, function(err, foundProduct){
            if(err){
                req.flash("error", "Product not found!")
                res.redirect("back");
            } else{
                //does user sell this product
                if(foundProduct.author.id.equals(req.user._id)){ //found=Object and req.user=String
                    next();
                }else{
                    req.flash("error", "You dont have permisson to do that!");
                    res.redirect("back")
                }     
            }
        });

    }else{
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                //does user sell this comment
                if(foundComment.author.id.equals(req.user._id)){ //found=Object and req.user=String
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back")
                }     
            }
        });

    }else{
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj