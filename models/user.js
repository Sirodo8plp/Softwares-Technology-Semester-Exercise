const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: String,
    email: String,
    type: String,
    profileImage: String
});

module.exports.userModel = mongoose.model('User' , userSchema);