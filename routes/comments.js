var express = require("express");
var router = express.Router({mergeParams: true});
var Inventory = require("../models/inventory");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/inventorys/:id/comments/new", middleware.isLoggedIn, function(req,res){
    
    Inventory.findById(req.params.id, function(err, inventory){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new.ejs",{inventory: inventory});
        }
    });
});

router.post("/inventorys/:id/comments", middleware.isLoggedIn, function(req, res){
    Inventory.findById(req.params.id, function(err, inventory){
        if(err){
            console.log(err);
            res.redirect("/inventorys.ejs");
        } else{
             Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                }else{
                    //add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    
                    inventory.comments.push(comment);
                    inventory.save();
                    req.flash("success", "Successfully Added Comment")
                    res.redirect("/inventorys/" + inventory._id);
                }
             });
        }
    }) ;
});

router.get("/inventorys/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit.ejs",{inventory_id : req.params.id, comment : foundComment}); 
        }
    });
    
});

router.put("/inventorys/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/inventorys/" + req.params.id);
        }
    });
});

router.delete("/inventorys/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment Deleted")
            res.redirect("/inventorys/" + req.params.id);
        }
    });
});





module.exports = router;
