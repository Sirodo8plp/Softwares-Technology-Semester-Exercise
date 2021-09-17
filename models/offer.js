var mongoose = require('mongoose');

let offerSchema = new mongoose.Schema({
    fromUser: String,
    offer: Number,
    project: String,
    date: String
});

module.exports.offerSchema = offerSchema;

module.exports.offerModel = mongoose.model('Offer' , offerSchema);