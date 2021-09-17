const mongoose = require('mongoose');

let DeveloperSchema = new mongoose.Schema({
    username: String,
    name: String,
    surname: String,
    email: String,
    password: String,
    dateofbirth: String,
    gender: String,
    type: String,
    verified: Boolean,
    privacy: Array,
    theme: String,
    profileImage: String,
    predefinedTags: String,
    customTags: String,
    cvName: String,
    developerLinks: Array
  });

module.exports.developerSchema = DeveloperSchema;
module.exports.developerModel = mongoose.model('Developer' , DeveloperSchema);

