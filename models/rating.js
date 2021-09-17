var mongoose = require('mongoose');

let ratingSchema = new mongoose.Schema({
    fromUser: String,
    toUser: String,
    rating: Number,
    comment: String,
    date: String
});

module.exports.ratingSchema = ratingSchema;

module.exports.ratingModel = mongoose.model('Rating' , ratingSchema);