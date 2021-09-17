const DeveloperRoutes = require('../controllers/DeveloperImplementedRoutes');
const express = require('express');
const router = express.Router();

router.post('/developer/checkExistence' , DeveloperRoutes.checkExistence);
router.post('/developer/uploadImage' , DeveloperRoutes.uploadImage);
router.post('/developer/uploadCV' , DeveloperRoutes.uploadCV);
router.post('/developer/signUp', DeveloperRoutes.signup);
router.get('/developer/loggedIn', DeveloperRoutes.loggedIn);
router.get('/developer/general', DeveloperRoutes.general);
router.get('/developer/profile' , DeveloperRoutes.profile);
router.get('/developer/options', DeveloperRoutes.options);
router.get('/developer/changeSetting/:PrivacyName/:newValue' , DeveloperRoutes.ChangePrivacyOption)
router.get('/developer/projects', DeveloperRoutes.projects);
router.get('/developer/getProjects' , DeveloperRoutes.getProjects);
router.get('/developer/completeProject/:projectID' , DeveloperRoutes.completeProject);
router.get('/developer/cancelProject/:projectID' , DeveloperRoutes.cancelProject);
router.get('/developer/viewProject/:projectID' , DeveloperRoutes.viewProject);
router.get('/developer/offers' , DeveloperRoutes.offers);
router.get('/developer/getOffers' , DeveloperRoutes.getOffers);
router.get('/developer/viewOffer/:offerID' , DeveloperRoutes.viewOffer);
router.get('/developer/getNotifications' , DeveloperRoutes.getNotifications);
router.get("/developer/changeTheme/:Theme" , DeveloperRoutes.changeTheme);
router.post("/developer/changeImage" , DeveloperRoutes.changeImage);
router.post("/developer/changeCv" , DeveloperRoutes.changeCv);
router.get("/developer/removeNotification/:fromUser" , DeveloperRoutes.removeNotification);
router.get("/developer/getRatings" , DeveloperRoutes.getRatings);
router.get("/developer/getComments" , DeveloperRoutes.getComments);
module.exports = router;