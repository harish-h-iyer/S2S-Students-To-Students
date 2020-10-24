var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    phoneno: String,
    upiId: String,
    studyin: String,
    batch: String,
    hostel: String
   
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);