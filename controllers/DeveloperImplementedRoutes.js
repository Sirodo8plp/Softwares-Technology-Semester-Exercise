require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const sendVerificationEmail = require(__dirname + "/../utilities/sendVerificationEmail");

const User = require(__dirname + "/../models/user").userModel;
const Developer = require(__dirname + "/../models/developer").developerModel;
const Project = require(__dirname + "/../models/project").projectModel;
const Offer = require(__dirname + "/../models/offer").offerModel;
const Notification = require(__dirname + "/../models/notification").notificationModel;
const Comment = require(__dirname + "/../models/comment").commentModel;
const Rating = require(__dirname + "/../models/rating").ratingModel;
const saveImage = require("./saveImage");
const saveCV = require("./saveCV");
const fs = require("fs");

/***********************************/
/***************SIGNUP*************/
/*********************************/

module.exports.checkExistence = async (req, res) => {
    try {
        let findByUsername = await User.find({
            username: req.body.username
        }).exec();
        let findByEmail = await User.find({
            email: req.body.email
        }).exec();

        if (findByUsername.length > 0) {
            res.json({
                message: "A user with this username already exists."
            });
        } else if (findByEmail.length > 0) {
            console.log("findbyemail");
            res.json({
                message: "A user with this email already exists."
            });
        } else
            res.json({
                message: "success"
            });
    } catch (error) {
        console.log(error);
        res.json({
            message: "An error occured with the database."
        });
    }
}

module.exports.uploadImage = async (req, res) => {
    saveImage(req, res, (err) => {
        if (err) {
            console.log(err);
            res.json({
                message: err
            })
        } else if (req.file == undefined) {
            res.json({
                message: "success",
                imageName: "profile.png"
            });
        } else {
            res.json({
                message: "success",
                imageName: req.file.filename
            });
        }
    });
}

module.exports.uploadCV = async (req, res) => {
    saveCV(req, res, (err) => {
        if (err) {
            console.log(err);
            res.json({
                message: err
            })
        } else if (req.file == undefined) {
            res.json({
                message: "success",
                cvName: ""
            });
        } else {
            res.json({
                message: "success",
                cvName: req.file.filename
            });
        }
    });
}

module.exports.signup = async (req, res) => {
    try {
        let newUser = new User({
            username: req.body.username,
            email: req.body.email,
            type: "Developer",
            profileImage: req.body.profileImage
        });

        await newUser.save();

        user_privacy = [];
        user_privacy.push({
            header: "Username",
            setting: true,
            objKey: "username"
        });
        user_privacy.push({
            header: "Name",
            setting: true,
            objKey: "name"
        });
        user_privacy.push({
            header: "Surname",
            setting: true,
            objKey: "surname"
        });
        user_privacy.push({
            header: "Email",
            setting: true,
            objKey: "email"
        });
        user_privacy.push({
            header: "Date of Birth",
            setting: true,
            objKey: "dateofbirth"
        });
        user_privacy.push({
            header: "Gender",
            setting: true,
            objKey: "gender"
        });

        let developer = new Developer({
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
            dateofbirth: req.body.dateofbirth,
            gender: req.body.gender,
            type: "Developer",
            verified: false,
            privacy: user_privacy,
            theme: "Light",
            profileImage: req.body.profileImage,
            predefinedTags: req.body.predefinedTags,
            customTags: req.body.customTags,
            cvName: req.body.cvName,
            developerLinks: req.body.developerLinks,
        });

        let savedDeveloper = await developer.save();
        res.app.locals.user = savedDeveloper;
        res.json({
            message: "success"
        });
    } catch (exception) {
        console.error(exception);
        res.redirect("/exceptionRaised");
    }
};

/**************************************/
/***************LOGGED IN*************/
/************************************/

module.exports.loggedIn = (req, res) => {
    res.render('developer/developer-general', {
        user: req.app.locals.user
    });
}

/**************************************/
/**************GENERAL*************/
/************************************/

module.exports.general = async (req, res) => {
    res.render('developer/developer-general', {
        user: await GetUserFromDatabase(res.app.locals.user._id)
    });
};

/************************************/
/***************PROFILE*************/
/**********************************/

module.exports.profile = async (req, res) => {
    let user = await GetUserFromDatabase(res.app.locals.user._id);
    res.render('developer/developer-profile', {
        user: user
    });
};

/************************************/
/***************OPTIONS*************/
/**********************************/

module.exports.options = async (req, res) => {
    res.render('developer/developer-settings', {
        user: await GetUserFromDatabase(res.app.locals.user._id)
    });
};

/******************************************/
/***************CHANGE OPTION*************/
/****************************************/

module.exports.ChangePrivacyOption = async (req, res) => {
    let new_privacy_values = res.app.locals.user.privacy;
    new_privacy_values.forEach(setting => {
        if (setting.objKey === req.params.PrivacyName)
            setting.setting = req.params.newValue === "true";
    });
    const filter = {
        _id: res.app.locals.user._id,
    }
    const update = {
        privacy: new_privacy_values
    }
    let newUser = await Developer.findOneAndUpdate(filter, update, {
        new: true
    });
    res.app.locals.user = newUser;
    res.status(200).json({
        message: 'Success'
    });
};

/*************************************/
/***************PROJECTS*************/
/***********************************/

module.exports.projects = async (req, res) => {
    res.app.locals.user = await GetUserFromDatabase(res.app.locals.user._id);
    res.render('developer/developer-projects', {
        user: res.app.locals.user
    });
};

/*****************************************/
/***************GET PROJECTS*************/
/***************************************/

module.exports.getProjects = async (req, res) => {
    try {
        let projects = await Project.find({
            developer: res.app.locals.user.username,
            acceptedByDeveloper: true,
            acceptedByCustomer: true
        }).sort({
            'status': -1
        });
        res.json(projects);
    } catch (error) {
        console.error(error)
        res.json({
            error: error
        });
    }
}

/**********************************************/
/***************COMPLETE PROJECTS*************/
/********************************************/

module.exports.completeProject = async (req, res) => {
    let projectID = req.params.projectID;
    const filter = {
        _id: projectID,
    }
    const update = {
        status: "Completed"
    }
    await Project.findOneAndUpdate(filter, update);
    res.redirect('/developer/projects');
}

/********************************************/
/***************CANCEL PROJECTS*************/
/******************************************/

module.exports.cancelProject = async (req, res) => {
    let projectID = req.params.projectID;
    const filter = {
        _id: projectID,
    }
    const update = {
        status: "Cancelled"
    }
    await Project.findOneAndUpdate(filter, update);
    res.redirect('/developer/projects');
}

/******************************************/
/***************VIEW PROJECTS*************/
/****************************************/

module.exports.viewProject = async (req, res) => {

}

/***********************************/
/***************OFFERS*************/
/*********************************/

module.exports.offers = async (req, res) => {
    res.app.locals.user = await GetUserFromDatabase(res.app.locals.user._id);
    res.render('developer/developer-offers', {
        user: res.app.locals.user
    });
};

/***************************************/
/***************GET OFFERS*************/
/*************************************/

module.exports.getOffers = async (req, res) => {
    try {
        let offers = await Offer.find({
            fromUser: res.app.locals.user._id,
        });
        // mongoose.connection.close();
        res.json(offers);
    } catch (error) {
        console.error(error)
        res.json({
            error: error
        });
    }
};

/***************************************/
/***************VIEW OFFER*************/
/*************************************/

module.exports.viewOffer = async (req, res) => {

}

/**********************************************/
/***************GET NOTIFICATIONS*************/
/********************************************/

module.exports.getNotifications = async (req, res) => {
    try {
        let notifications = await Notification.find({
            toUser: res.app.locals.user.username,
        });
        res.json(notifications);
    } catch (error) {
        console.error(error)
        res.json({
            error: error
        });
    }
}

/*****************************************/
/***************CHANGE THEME*************/
/***************************************/

module.exports.changeTheme = async (req, res) => {
    try {
        let newTheme = req.params.Theme;
        const filter = {
            _id: req.app.locals.user._id,
        }
        const update = {
            theme: newTheme
        }
        await Developer.findOneAndUpdate(filter, update);
        res.json({
            message: "success"
        });
    } catch (error) {
        console.log(error)
        res.json({
            message: error
        });
    }
}

module.exports.changeImage = async (req, res) => {
    saveImage(req, res, async (err) => {
        let newImage;
        if (err) {
            console.log(err);
            res.render('developer/developer-profile');
            return;
        } else if (req.file == undefined) {
            newImage = 'profile.png';
        } else
            newImage = req.file.filename;
        if (req.app.locals.user.profileImage !== 'profile.png')
            fs.unlinkSync(__dirname + `/../public/images/${req.app.locals.user.profileImage}`);
        let filter = {
            username: req.app.locals.user.username
        };
        let update = {
            profileImage: newImage
        }
        let options = {
            new: true
        }
        let newUser = await Developer.findOneAndUpdate(filter, update, options);
        res.app.locals.user = newUser;
        res.render('developer/developer-profile', {
            user: newUser
        });
    });
}

module.exports.changeCv = async (req, res) => {
    saveCV(req, res, async (err) => {
        let newCv;
        if (err) {
            console.log(err);
            res.render('developer/developer-profile');
            return;
        } else if (req.file == undefined) {
            newCv = '';
        } else
            newCv = req.file.filename;
        if (req.app.locals.user.cvName !== '')
            fs.unlinkSync(__dirname + `/../public/cvs/${req.app.locals.user.cvName}`);
        let filter = {
            username: req.app.locals.user.username
        };
        let update = {
            cvName: newCv
        }
        let options = {
            new: true
        }
        let newUser = await Developer.findOneAndUpdate(filter, update, options);
        res.app.locals.user = newUser;
        res.render('developer/developer-profile', {
            user: newUser
        });
    });
}

module.exports.removeNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({
            fromUser: req.params.fromUser,
            toUser: req.app.locals.user.username
        });
        res.redirect('/developer/general');
    } catch (error) {
        console.log(error);
    }
}

module.exports.getComments = async (req,res) => {
    try {
        let comments = await Comment.find({
            toUser: req.app.locals.user.username
        });
        res.json({comments});
    } catch (error) {
        res.json({error});
    }
}

module.exports.getRatings = async (req,res) => {
    try {
        let ratings = await Rating.find({
            toUser: req.app.locals.user.username
        });
        res.json({ratings});
    } catch (error) {
        res.json({error});
    }
}

/*********************************/
/***************MISC*************/
/*******************************/

module.exports.GetSignUpValues = (req, res, next) => {
    const form_values = new Map();
    form_values.set('username', req.body.username);
    form_values.set('name', req.body.name);
    form_values.set('surname', req.body.surname);
    form_values.set('email', req.body.email);
    form_values.set('password', bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)));
    form_values.set('dateofbirth', req.body.dateofbirth);
    form_values.set('gender', req.body.gender);

    res.locals.credentials = form_values;
    next();
}

async function RegisterUserToTheDatabase(user) {
    let obj = await user.save();
}

function falseLogIn(res) {
    res.redirect('/falselogin');
}

async function GetUserFromDatabase(username) {
    let query = {
        _id: username
    };
    let database_user = await Developer.findOne(query);
    return database_user;
}