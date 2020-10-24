var mongoose = require("mongoose");
var Inventory = require("./models/inventory");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Ink pen", 
        image: "https://pixabay.com/get/51e9d7424857b108f5d084609620367d1c3ed9e04e50744177277fd09f45cd_340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        specification: "adadada",
        yop:"2020",
        price:"2"
    },
    {
        name: "Headphone", 
        image: "https://pixabay.com/get/57e2d54a4b50ad14f6da8c7dda793f7f1636dfe2564c704c7d2d73d09345cd50_340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        specification: "adadada",
        yop:"2020",
        price:"2"

    },
    {
        name: "iPhone", 
        image: "https://pixabay.com/get/5ee2dd4a4b53b108f5d084609620367d1c3ed9e04e507441762873d2934fc4_340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        specification: "adadada",
        yop:"2020",
        price:"2"
    }
]

function seedDB(){
   Inventory.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Product!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
         
            data.forEach(function(seed){
                Inventory.create(seed, function(err, inventory){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a inventory");
                        Comment.create(
                            {
                                text: "Can we negotiate?",
                                author: "Harish"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    inventory.comments.push(comment);
                                    inventory.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });   
    });  
}

module.exports = seedDB;