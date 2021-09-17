const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
const hiddenData = require(__dirname + "/../data");
let DATA = new hiddenData();
let mongoOptions = {
  useNewUrlParser: true
};
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Developer = require(__dirname + "/../models/developer").developerModel;


/************************************************/
/******************ROUTER BODY******************/
/**********************************************/

router.get('/:userid', async (req, res) => {
  mongoose.connect(DATA.getMongoConnectionString(), mongoOptions);
  try{
    const id = req.params.userid;
    const update = {verified: true};
    const options = {new: true}
    let customer = await mongoose.model('developer').findByIdAndUpdate(id,update,options);
    req.app.locals.user = customer;
    if(customer.type === "customer") res.redirect('/customer/loggedIn');
  }
  catch(error){
    console.error(error);
    res.redirect("/exceptionRaised");
  }
});

module.exports = router;
