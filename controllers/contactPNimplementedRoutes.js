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
const Contact = require(__dirname + "/../models/contact").contactModel;

module.exports.append = async (req,res) => {
    let contact = new Contact({
        userid: res.app.locals.user._id,
        text: req.body.contactMessage,
        date: new Date().toDateString()
    });

    try {
        await contact.save();
        res.redirect('/contact/success')
    }
    catch(e){
        console.error(e);
    }
}

module.exports.success = (req,res) => {
    res.render('home/afterContactHasBeenMade');
}