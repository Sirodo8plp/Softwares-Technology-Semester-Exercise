require('dotenv').config();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const User = require(__dirname + "/../models/user").userModel;
const Customer = require(__dirname + "/../models/customer").customerModel;
const Project = require(__dirname + "/../models/project").projectModel;
const Notification = require(__dirname + "/../models/notification").notificationModel;
const saveImage = require("./saveImage");
const Rating = require(__dirname + "/../models/rating").ratingModel;
const Comment = require(__dirname + "/../models/comment").commentModel;

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
            res.json({
                message: "A user with this email already exists."
            });
        } else
            res.json({
                message: "success"
            })
    } catch (error) {
        console.log(error);
    }
}

module.exports.saveImage = (req, res) => {
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

module.exports.signup = async (req, res) => {
    try {
        let newUser = new User({
            username: req.body.username,
            email: req.body.email,
            type: "Customer",
            profileImage: req.body.profileImage
        })

        await newUser.save();

        let user_privacy = [];
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
            objKey: "birthdate"
        });
        user_privacy.push({
            header: "Gender",
            setting: true,
            objKey: "gender"
        });
        let newCustomer = new Customer({
            email: req.body.email,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
            type: "Customer",
            name: req.body.name,
            surname: req.body.surname,
            gender: req.body.gender,
            birthdate: req.body.dateofbirth,
            bio: req.body.bio,
            profileImage: req.body.profileImage,
            privacy: user_privacy,
            theme: "Light"
        });
        let savedCustomer = await newCustomer.save();
        res.app.locals.user = savedCustomer;
        res.json({
            message: "success"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.general = (req, res) => {
    res.render("customer/customer-general");
}

module.exports.loggedIn = (req, res) => {
    res.redirect('/customer/general');
}

module.exports.profile = async (req, res) => {
    req.app.locals.user = await GetCustomer(req.app.locals.user.username);
    res.render('customer/customer-profile', {
        user: req.app.locals.user
    })
}

module.exports.createProject = (req, res) => {
    res.render("home/create_project");
}

module.exports.projects = (req, res) => {
    res.render("customer/customer-projects");
}

module.exports.changeImage = async (req, res) => {
    saveImage(req, res, async (err) => {
        let newImage;
        if (err) {
            console.log(err);
            res.render('customer/customer-profile');
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
        let newUser = await Customer.findOneAndUpdate(filter, update, options);
        res.app.locals.user = newUser;
        res.render('customer/customer-profile', {
            user: newUser
        });
    });
}

module.exports.changeBio = async (req, res) => {
    let filter = {
        username: req.app.locals.user.username
    };
    let update = {
        bio: req.body.newBio
    }
    let options = {
        new: true
    }
    res.app.locals.user = await Customer.findOneAndUpdate(filter, update, options);
    res.render('customer/customer-profile', {
        user: res.app.locals.user
    });
}

module.exports.options = (req, res) => {
    res.render("customer/customer-options");
}

module.exports.changeOption = async (req, res) => {
    let new_privacy_values = res.app.locals.user.privacy;
    new_privacy_values.forEach(setting => {
        if (setting.objKey === req.params.settingName)
            setting.setting = req.params.newValue === "true";
    });
    const filter = {
        username: res.app.locals.user.username,
    }
    const update = {
        privacy: new_privacy_values
    }
    let newUser = await Customer.findOneAndUpdate(filter, update, {
        new: true
    });
    res.app.locals.user = newUser;
    res.status(200).json({
        message: 'Success'
    });
}

module.exports.changeTheme = async (req, res) => {
    try {
        let newTheme = req.params.theme;
        const filter = {
            username: req.app.locals.user.username,
        }
        const update = {
            theme: newTheme
        }
        await Customer.findOneAndUpdate(filter, update, {
            new: true
        });
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

module.exports.getProjects = async (req, res) => {
    try {
        let projects = await Project.find({
            projectOwner: req.app.locals.user.username
        });
        res.json(projects);
    } catch (error) {
        console.log(error);
        res.json({
            error: "An error occured with the database"
        });
    }
}

module.exports.getNotifications = async (req, res) => {
    try {
        let notifications = await Notification.find({
            toUser: req.app.locals.user.username
        })
        res.json(notifications);
    } catch (error) {
        console.log(error);
        res.json({
            error: "An error occured with the database"
        });
    }
}

module.exports.removeNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({
            fromUser: req.params.fromUser,
            toUser: req.app.locals.user.username
        });
        res.redirect('/customer/general');
    } catch (error) {
        console.log(error);
    }
}

module.exports.rateDeveloper = async(req,res) => {
    await Rating.deleteMany({
        fromUser: req.app.locals.user.username,
        toUser: req.query.developerUsername
    });

    let rating = new Rating({
        fromUser: req.app.locals.user.username,
        toUser: req.query.developerUsername,
        rating: req.query.rating,
        comment: req.query.ratingComment, 
        date: new Date().toLocaleDateString()
    });
    await rating.save();
    res.redirect(`/home/visitDeveloper/${req.query.developerUsername}`);
}

async function GetCustomer(username) {
    try {
        let user = await Customer.findOne({
            username: username
        });
        return user;
    } catch (error) {
        console.error(error);
    }
}