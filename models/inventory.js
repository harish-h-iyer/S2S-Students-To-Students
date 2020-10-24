var mongoose = require("mongoose");

var inventorySchema = new mongoose.Schema({
    name: String,   
    image: String,
    description: String,
    specifications: String,
    yop: String,
    price: String,
    createdAt: { type: Date, default: Date.now },
    author: {
       id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"   
       },
       username: String
    },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

module.exports = mongoose.model("Inventory", inventorySchema);
