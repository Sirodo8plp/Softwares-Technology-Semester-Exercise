var express = require('express')
var router = express.Router()
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
var mongoose = require('mongoose');var bcrypt = require('bcryptjs');
var userModel = require(__dirname + "/../models/user").userModel;

router.post('/', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    let query = {
      username: username
    };
    let database_user = await userModel.findOne(query);
    if (!database_user) {
      res.redirect('/falseloginContact');
      return;
    }
    let user_password = database_user.password || "";
    let password_authentication = await bcrypt.compare(password, user_password);

    if (password_authentication) {
      req.app.locals.user = database_user;
      mongoose.connection.close();
      res.redirect('/signedIn/contact');
    }
    else{
      console.log("wait");
    }
  } catch (exception) {
    console.error(exception);
    res.redirect("/exceptionRaised");
  }
});

module.exports = router;