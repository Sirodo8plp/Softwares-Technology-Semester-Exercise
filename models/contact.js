var mongoose = require('mongoose');

let contactPN = new mongoose.Schema({
    userid: String,
    text: String,
    date: String,
});

module.exports.contactSchema = contactPN;
module.exports.contactModel = mongoose.model('Contact' , contactPN);