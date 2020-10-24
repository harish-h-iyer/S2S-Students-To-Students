var express = require("express");
var router = express.Router();
var Inventory = require("../models/inventory");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var multer = require("multer");
var sharp = require("sharp");
var fs = require("fs-extra")


// FILE UPLOADING MANAGEMENT
const uploadConfig = function(){
	// using multer to define filename
	const storage = multer.diskStorage({
		filename: function(req, file, callback){
			callback(null, Date.now() + file.originalname);
		}
	});
	return multer({storage, fileFilter: imageFilter});
}


const imageFilter = function(req, file, callback){
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return callback(new Error("Only image files (jpg, jpeg, png or gif) are allowed!"), false);
	} else {
		callback(null, true);
	}
};


const imageStore = function(req, res){
	// here we optimize the image using 'sharp', by taking the uploaded 
	// image, compressing and resizing it
	sharp(req.file.path)
	.jpeg({quality: 80})
	.resize(1200)
	.toFile(`images/inventorys/${req.file.filename}`, 
	(err) => {
		if (err) {
			req.flash("error", "Could not store image file");
			console.log(err);
			return res.redirect("back");
		}
	});
}

const escapeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

router.get("/inventorys", function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    let noMatch = null;
    if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Inventory.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allInventorys) {
        Inventory.count({name: regex}).exec(function (err, count) {
        if (err) { console.log(err); res.redirect("back") }
      else {
        if (allInventorys.length < 1) {
          noMatch = "No Product found, please try again.";
        }
        res.render("inventorys/inventorys.ejs", { allInventorys : allInventorys, current: pageNumber,
            pages: Math.ceil(count / perPage),
            noMatch: noMatch,
            search: req.query.search
         });   
       }
    });
});
  } else {
    // Get all inventory from DB
    Inventory.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allInventorys) {
        Inventory.count().exec(function (err, count) {
        if (err) { console.log(err); }
      else {
        res.render("inventorys/inventorys.ejs", { allInventorys : allInventorys, current: pageNumber,
            pages: Math.ceil(count / perPage),
            noMatch: noMatch,
            search: false
        });  
      }
    }); 
    });
  }
}); 

router.post("/inventorys",middleware.isLoggedIn, uploadConfig().single("image"), function(req, res){
    imageStore(req, res);
    const imageName = `${req.file.filename}`;
    

    var name = req.body.name;
    var image = imageName;
    var desc = req.body.description;
    var specs = "\r\n"+ req.body.specifications;
    var yop = req.body.yop;
    var price = req.body.price;

    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newInventory = {name:name, image:image, description:desc, specifications:specs, yop:yop, price:price, author:author}
    
    Inventory.create(newInventory, function(err, newlyCreated){
        if(err){
            console.log(err)
        }
        else{
            req.flash("success", "Product Added Successfully")
            res.redirect("/inventorys");
        }
    });

});

router.get("/inventorys/new", middleware.isLoggedIn, function(req, res){
    res.render("inventorys/new.html");
});

router.get("/inventorys/:id", function(req, res){
    var no_click = 0;
    Inventory.findById(req.params.id).populate("comments").exec(function(err, foundProduct){
        if(err){
            console.log(err);
        }
        else{
            res.render("inventorys/show.ejs", {inventory: foundProduct, n: no_click});
        }
    });
});

router.get("/inventorys/:id/specs", function(req, res){
    Inventory.findById(req.params.id).populate("comments").exec(function(err, foundProduct){
        if(err){
            console.log(err);
        }
        else{
            res.render("inventorys/specs.ejs", {inventory: foundProduct});
        }
    });
});


//Edit Inventory

router.get("/inventorys/:id/edit",middleware.checkInventoryOwnership, function(req, res){
        Inventory.findById(req.params.id, function(err, foundProduct){
                    res.render("inventorys/edit.ejs", {inventory: foundProduct});  
        });    
});

//Update Inventory

router.put("/inventorys/:id",middleware.checkInventoryOwnership, function(req, res){
    //find and update correct product
    Inventory.findByIdAndUpdate(req.params.id, req.body.inventory, function(err, updatedInventory){
        if(err){
            res.redirect("/inventorys.ejs");
        }else{
            req.flash("success", "Inventory edited successfully");
            res.redirect("/inventorys/" + req.params.id);
        }

    })
});

//Delete Route
router.delete("/inventorys/:id", middleware.checkInventoryOwnership, function(req, res){
    Inventory.findById(req.params.id, (err, inventory) => {			
		// delete campground image from server folder
		fs.unlink(`images/inventorys/${inventory.image}`, (err) => {
			if(err){
				console.log(err);
			}
		});
	});

    
    Inventory.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/inventorys");
        }else{
            req.flash("success", "Product Removed")
            res.redirect("/inventorys");
        }
    });
});


module.exports = router;