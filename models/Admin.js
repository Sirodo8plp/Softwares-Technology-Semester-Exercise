const mongoose = require("mongoose");

let adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
    email: String
});

module.exports.adminModel = mongoose.model('Admin' , adminSchema);