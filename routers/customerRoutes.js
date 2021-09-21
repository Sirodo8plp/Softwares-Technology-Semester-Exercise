const CustomerRoutes = require('../controllers/CustomerImRo');
const express = require('express');
const router = express.Router();

router.post("/customer/checkExistence" , CustomerRoutes.checkExistence);
router.post("/customer/uploadImage" , CustomerRoutes.saveImage);
router.post("/customer/changeProfileImage" , CustomerRoutes.changeImage);
router.post("/customer/signup" , CustomerRoutes.signup);
router.get("/customer/loggedIn" , CustomerRoutes.loggedIn);
router.get("/customer/general" , CustomerRoutes.general);
router.get("/customer/profile" , CustomerRoutes.profile);
router.post("/customer/changeBio" , CustomerRoutes.changeBio);
router.get("/customer/options" , CustomerRoutes.options);
router.get("/customer/changeSetting/:settingName/:newValue" , CustomerRoutes.changeOption);
router.get("/customer/changeTheme/:theme" , CustomerRoutes.changeTheme);
router.get("/customer/createProject" , CustomerRoutes.createProject);
router.get("/customer/projects" , CustomerRoutes.projects);
router.get("/customer/getProjects" , CustomerRoutes.getProjects);
router.get("/customer/getNotifications" , CustomerRoutes.getNotifications);
router.get("/customer/removeNotification/:fromUser" , CustomerRoutes.removeNotification);
router.get("/customer/rateDev"  , CustomerRoutes.rateDeveloper);


module.exports = router;