var mongoose = require('mongoose');

let notificationSchema = new mongoose.Schema({
    fromUser: String,
    toUser: String,
    notification: String,
    date: String,
    link: String,
    projectInvolved: String,
    actions: String
});

module.exports.notificationSchema = notificationSchema;

module.exports.notificationModel = mongoose.model("Notification" , notificationSchema);