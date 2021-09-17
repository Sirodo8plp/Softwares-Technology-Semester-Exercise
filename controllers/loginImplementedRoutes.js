require('dotenv').config();
const express = require('express')
const app = express();
app.set('view engine', 'ejs');

const bcrypt = require('bcryptjs');
const User = require(__dirname + "/../models/user").userModel;
const Developer = require(__dirname + "/../models/developer").developerModel;
const Customer = require(__dirname + "/../models/customer").customerModel;
const Admin = require(__dirname + "/../models/Admin").adminModel;

module.exports.login = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    let admin = await Admin.findOne({
      username: username,
      password: password
    });
    if(admin){
      res.app.locals.user = admin;
      res.redirect("/admin/general");
      return;
    }
    let query = {
      username: username
    };
    let database_user = await User.findOne(query);
    if (database_user === null) {
      res.redirect('/falselogin');
      return;
    }

    let user;
    let path = "";

    if (database_user.type === "Developer"){
      user = await Developer.findOne({
        username: username
      });
      path = "/developer/loggedIn";
    }
    else if (database_user.type === "Customer"){
      user = await Customer.findOne({
        username: username
      });
      path = "customer/loggedIn";
    }

    let user_password = user.password || "";
    let password_authentication = await bcrypt.compare(password, user_password);
    if (password_authentication === true){
      res.app.locals.user = user;
      res.redirect(path);
    }
    else  
      res.redirect('/falselogin');
  } catch (exception) {
    console.error(exception);
    res.redirect("/exceptionRaised");
  }
};

module.exports.logout = (req, res) => {
  req.app.locals.user = null;
  res.redirect('/');
}

module.exports.falselogin = (req, res) => {
  res.render("home/login", {
    notfound: true
  });
}

module.exports.falseLoginContact = (req, res) => {
  res.render('home/contactProjectsNest', {
    notfound: true
  });
}

module.exports.signedInContact = (req, res) => {
  res.render('home/contactProjectsNest');
}

module.exports.userExists = (req, res) => {
  res.render("home/login", {
    userExists: true,
    existMessage: res.app.locals.userExists
  });
}