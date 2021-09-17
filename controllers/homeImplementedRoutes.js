require('dotenv').config();
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const Project = require(__dirname + "/../models/project").projectModel;
const User = require(__dirname + "/../models/user").userModel;
const Customer = require(__dirname + "/../models/customer").customerModel;
const Developer = require(__dirname + "/../models/developer").developerModel;
const Rating = require(__dirname + "/../models/rating").ratingModel;
const Comment = require(__dirname + "/../models/comment").commentModel;


module.exports.home = (req, res) => {
    res.render("home/index", {
        username: ""
    });
}

module.exports.loginPage = (req, res) => {
    res.render("home/login");
}

module.exports.contact = (req, res) => {
    res.render('home/contactProjectsNest');
}

module.exports.about = (req, res) => {
    res.render('home/about');
}

module.exports.marketplace = async (req, res) => {
    res.render("home/marketplace");
}

module.exports.profile = (req, res) => {
    if (req.app.locals.user.type === "Developer")
        res.redirect("/developer/profile");
    else if (req.app.locals.user.type === "Customer")
        res.redirect("/customer/general");
    else
        res.redirect("/admin/general");
}

module.exports.findWhoIsWho = (req, res) => {
    try {
        res.json({
            type: req.app.locals.user.type,
            username: req.app.locals.user.username,
            image: req.app.locals.user.profileImage
        });
    } catch (error) {
        res.json({
            type: "Guest",
            username: ""
        });
    }
}

module.exports.searchAsync = async (req, res) => {
    try {
        let searchFilter = new RegExp(req.params.inputValue, "g");
        let projects = await Project.find({
            title: searchFilter
        });
        let users = await User.find({
            username: searchFilter
        });
        res.json({
            projects,
            users
        });
    } catch (error) {
        console.error(error);
        res.json({
            error
        })
    }

}

module.exports.visitCustomer = async (req, res) => {
    try {
        let customer = await Customer.findOne({
            username: req.params.username
        });
        let projects = await Project.find({
            projectOwner: customer.username
        });

        res.render("viewSearchResult/viewCustomer", {
            user: customer,
            projects: projects
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports.visitDeveloper = async (req, res) => {
    try {
        let developer = await Developer.findOne({
            username: req.params.username
        });
        let projects = await GetDeveloperProjects(req.params.username);
        let ratingScore = await GetRatingScore(req.params.username);
        console.log(ratingScore);
        let comments = await GetComments(req.params.username);
        let ratings = await GetRatings(req.params.username);
        let UserType;
        try {
            UserType = req.app.locals.user.type;
        } catch (error) {
            UserType = "Guest";
        }
        res.render("viewSearchResult/viewDeveloper", {
            developer: developer,
            projects: projects,
            ratingScore: ratingScore,
            ratings: ratings,
            comments: comments,
            userType: UserType
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports.getDevelopers = async (req, res) => {
    try {
        let searchFilter = new RegExp(req.params.inputValue, "g");
        let developers = await Developer.find({
            username: searchFilter
        });
        res.json({
            developers
        });
    } catch (error) {
        res.json({
            message: "error"
        });
    }
}

module.exports.commentDev = async (req, res) => {
    let comment = new Comment({
        fromUser: req.app.locals.user.username,
        profileImage: req.app.locals.user.profileImage,
        toUser: req.query.developerUsername,
        comment: req.query.comment,
        date: new Date().toLocaleDateString()
    });
    await comment.save();
    res.redirect(`/home/visitDeveloper/${req.query.developerUsername}`);
}

module.exports.viewPeople = (req, res) => {
    res.render("home/people");
}

module.exports.peopleGetDevelopers = async (req, res) => {
    try {
        let developers = await Developer.find();
        let customTags = await Developer.find({}, 'customTags');
        let customTagsRaw = [];
        let counter = 0;
        customTags.forEach((tagObj) => {
            tagObj.customTags.split(",").forEach(tech => {
                customTagsRaw[counter] = tech;
                counter++;
            });
        });
        let tags = [...new Set(customTagsRaw)];
        res.json({
            developers,
            message: "Success",
            tags
        });
    } catch (error) {
        console.log(error);
        res.json({
            developers: [],
            message: "Failure",
            tags: []
        });
    }
}

module.exports.peopleGetCustomers = async (req, res) => {
    try {
        let customers = await Customer.find();
        res.json({
            customers,
            message: "Success"
        });
    } catch (error) {
        res.json({
            customers: [],
            message: "Failure"
        });
    }
}

//filter developers in 'People' Tab
module.exports.filter = async (req, res) => {
    try {
        let predefinedTags = req.body.predefinedTags === "" ? /.*/i : new RegExp(req.body.predefinedTags, 'i');
        let customTags = req.body.customTags === "" ? /.*/i : new RegExp(req.body.customTags, 'i');
        let rating = parseFloat(req.body.rating);
        let completedProjects = parseInt(req.body.completedProjects);
        let filters = {
            predefinedTags,
            customTags
        };
        let developers = await Developer.find(filters);

        if (developers.length === 0) {
            res.json({
                message: "success",
                developers
            });
            return;
        }
        developers.sort(sortDevelopers);
        let queryString = "";
        developers.forEach(dev => queryString += dev.username + " ");
        queryString = new RegExp(queryString.trimEnd().replace(/[ ,]+/g, "|"));
        let ratingScores = await Rating.find({
            toUser: queryString
        });

        let projects = await Project.find({
            developer: queryString,
            completedByDeveloper: true,
            completedByCustomer: true
        });

        if((ratingScores.length === 0 && rating > 0) ||
            (completedProjects > 0 && projects.length === 0)){
            res.json({
                message: "success",
                developers: []
            });
            return
        }
        ratingScores.sort(sortRatings);
        if(ratingScores.length > 0 && rating > 0){
            let temp = [];
            for(let i=0;i<developers.length;i++){
                let sum = counter = 0;
                for(let j=0;j<ratingScores.length;j++){
                    if(ratingScores[j].toUser === developers[i].username){
                        sum += ratingScores[j].rating;
                        counter += 1;
                    }
                    else break;
                }
                sum = counter === 0? 0 : sum/counter;
                if(sum >= rating) {
                    temp.push(developers[i]);
                }
                else developers.splice(i,1);
            }
            developers = temp;
        }

        if(projects.length > 0 && completedProjects > 0) {
            projects.sort(sortProjects);
            let temp = [];
            for(let i=0;i<developers.length;i++){
                let counter = 0;
                for(let j=0;j<projects.length;j++){
                    if(projects[j].developer === developers[i].username){
                        counter += 1;
                    }
                    else break;
                }
                if(counter > 0) {
                    temp.push(developers[i]);
                }
            }
            developers = temp;
        }
        res.json({
            message: "success",
            developers
        });

    } catch (error) {
        console.error(error);
    }
}

/********************************/
/**************MISC*************/
/******************************/

async function GetRatingScore(username) {
    let ratings = await Rating.find({
        toUser: username
    });
    if (ratings.length === 0) {
        return {
            ratingScore: 0,
            totalRatings: 0,
        }
    }
    let sum = 0;
    ratings.forEach(rating => {
        sum += rating.rating
    });
    sum = sum / ratings.length;
    return {
        ratingScore: sum,
        totalRatings: ratings.length
    }
}

async function GetComments(username) {
    let comments = await Comment.find({
        toUser: username
    }).sort({
        "_id": -1
    });
    return comments
}

async function GetRatings(username) {
    let ratings = await Rating.find({
        toUser: username
    });
    return ratings;
}

async function GetDeveloperProjects(username) {
    let projects = await Project.find({
        developer: username
    });
    let completedProjectsCount = 0;
    let inProgressProjectsCount = 0;
    if (projects.length === 0) {
        return {
            completedProjectsCount,
            inProgressProjectsCount
        }
    }
    projects.forEach(project => {
        if (project.status === "Completed")
            completedProjectsCount += 1;
        else if (project.status === "In Progress")
            inProgressProjectsCount += 1;
    });
    return {
        completedProjectsCount,
        inProgressProjectsCount
    }
}






async function filterDevelopersForRating(developers, ratingBoundary) {
    developers.filter(developer => {

    })
}

async function developerHasCompletedProjects(developer, boundary) {
    let projects = await Project.find({
        developer: developer.username
    });
    if (projects.length < boundary) return false;
    return true
}

/******************************************/
/**************SORT FUNCTIONS*************/
/****************************************/

function sortDevelopers(devA, devB) {
    if (devA.username < devB.username) return -1;
    if (devA.username > devB.username) return 1;
    return 0
}

function sortRatings(ratA, ratB) {
    if (ratA.toUser < ratB.toUser) return -1;
    if (ratA.toUser > ratB.toUser) return 1;
    return 0
}

function sortProjects(projA, projB) {
    if (projA.developer < projB.developer) return -1;
    if (projA.developer > projB.developer) return 1;
    return 0
}