const mongoose = require('mongoose');

let customerSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    type: String,
    name: String,
    surname: String,
    gender: String,
    birthdate: String,
    bio: String,
    profileImage: String,
    privacy: Array,
    theme: String
});

module.exports.customerModel = mongoose.model('Customer', customerSchema);