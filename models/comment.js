var mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
    toUser: String,
    profileImage: String,
    comment: String,
    fromUser: String,
    date: String,
});

module.exports.commentSchema = commentSchema;

module.exports.commentModel = mongoose.model('Comment' , commentSchema);