const loginRoutes = require('../controllers/loginImplementedRoutes');
const express = require('express');
const router = express.Router();

router.post('/login' , loginRoutes.login);
router.get('/logout' , loginRoutes.logout);
router.get('/falselogin' , loginRoutes.falselogin);
router.get('/falseloginContact' , loginRoutes.falseLoginContact);
router.get('/signedIn/contact' , loginRoutes.signedInContact);
router.get('/userExists' , loginRoutes.userExists);

module.exports = router;