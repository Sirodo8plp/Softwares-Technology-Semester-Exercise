var mongoose = require('mongoose');

let projectSchema = new mongoose.Schema({
    projectOwner: String,
    developer: String,
    acceptedByDeveloper: Boolean,
    acceptedByCustomer: Boolean,
    completedByDeveloper: Boolean,
    completedByCustomer: Boolean,
    title: String,
    description: String,
    date: String,
    offer: String,
    technologies: String,
    projectVisibility: String,
    offerVisibility: String,
    category: String,
    subcategory: String,
    status: String /*[In Progress, Completed , Cancelled] */,
    paymentType: String,
    offerDuration: String,
    projectDevelopmentDuration: String,
    offers: Array,
    oldOffer: String, /*for rollback operation*/
});

module.exports.projectSchema = projectSchema;
module.exports.projectModel = mongoose.model('Project' , projectSchema);
