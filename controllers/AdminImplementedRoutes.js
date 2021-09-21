require('dotenv').config();
const express = require('express')
const app = express();
app.set('view engine', 'ejs');
require('dotenv').config();
const fs = require('fs');
const User = require(__dirname + "/../models/user").userModel;
const Customer = require(__dirname + "/../models/customer").customerModel;
const Project = require(__dirname + "/../models/project").projectModel;
const Notification = require(__dirname + "/../models/notification").notificationModel;
const Developer = require(__dirname + "/../models/developer").developerModel;
const Rating = require(__dirname + "/../models/rating").ratingModel;
const Comment =require(__dirname + "/../models/comment").commentModel;

module.exports.general = async (req, res) => {
    res.render("admin/admin-general");
}

module.exports.customers = async (req, res) => {
    res.render("admin/admin-customers", {
        user: req.app.locals.user
    })
}

module.exports.getCustomers = async (req, res) => {
    try {
        let customers = await Customer.find({});
        res.json({
            customers
        });
    } catch (error) {
        res.json({
            message: error
        });
    }
}

module.exports.developers = async (req, res) => {
    res.render("admin/admin-developers");
}

module.exports.getDevelopers = async (req, res) => {
    try {
        let developers = await Developer.find({});
        res.json({
            developers
        });
    } catch (error) {
        res.json({
            message: error
        });
    }
}

module.exports.projects = async (req, res) => {
    res.render("admin/admin-projects");
}

module.exports.getProjects = async (req, res) => {
    try {
        let projects = await Project.find({});
        res.json({
            projects
        });
    } catch (error) {
        res.json({
            message: error
        });
    }
}

module.exports.deleteCustomer = async (req, res) => {
    try {
        let customer = await Customer.findOne({
            _id: req.params.customerID
        });

        if (customer.profileImage !== "profile.png") {
            fs.unlinkSync(__dirname + `/../public/images/${customer.profileImage}`);
        }

        await Notification.deleteMany({
            toUser: customer.username
        });

        await Notification.deleteMany({
            fromUser: customer.username
        });

        await Project.deleteMany({
            projectOwner: customer.username
        });

        await User.findOneAndDelete({
            username: customer.username
        });

        await Customer.findOneAndDelete({
            username: customer.username
        });

        res.redirect("/admin/customers")
    } catch (error) {
        console.error(error);
    }
}

module.exports.deleteDeveloper = async (req, res) => {
    try {
        let developer = await Developer.findOne({
            _id: req.params.developerID
        });

        if (developer.profileImage !== "profile.png") {
            fs.unlinkSync(__dirname + `/../public/images/${developer.profileImage}`);
        }

        if (developer.cvName !== "") {
            fs.unlinkSync(__dirname + `/../public/cvs/${developer.cvName}`);
        }

        await Notification.deleteMany({
            toUser: developer.username
        });

        await Notification.deleteMany({
            fromUser: developer.username
        });

        await User.findOneAndDelete({
            username: developer.username
        });

        await Developer.findOneAndDelete({
            username: developer.username
        });

        await Comment.deleteMany({
            toUser: developer.username
        });

        await Comment.deleteMany({
            fromUser: developer.username
        });

        await Rating.deleteMany({
            toUser: developer.username
        });

        res.redirect("/admin/developers");
    } catch (error) {
        console.error(error)
    }
}

module.exports.deleteProject = async (req, res) => {
    try {
        let project = await Project.findOne({
            _id: req.params.projectID
        });

        await Notification.deleteMany({
            projectInvolved: project.title
        });

        await Project.findOneAndDelete({
            title: project.title
        });

        res.redirect('/admin/projects');
    } catch (error) {
        console.error(error)
    }
}