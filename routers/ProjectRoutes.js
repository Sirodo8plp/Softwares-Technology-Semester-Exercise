const ProjectImplementedRoutes = require('../controllers/ProjectImplementedRoutes');
const express = require('express');
const router = express.Router();

router.get('/project/completeProject/:ProjectID' , ProjectImplementedRoutes.completeProject);
router.get('/project/deleteProject/:ProjectID' , ProjectImplementedRoutes.completeProject);
router.get('/project/checkExistence/:title' , ProjectImplementedRoutes.checkExistence);
router.post('/project/createProject' , ProjectImplementedRoutes.completeProject);
router.get('/project/addOffer/:ProjectID/:offerValue' , ProjectImplementedRoutes.completeProject);
router.get('/project/acceptByDeveloper/:ProjectID' , ProjectImplementedRoutes.completeProject);
router.get('/project/acceptByCustomer/:ProjectID' , ProjectImplementedRoutes.completeProject);
router.get('/project/changeSetting/:SettingName/:NewSettingValue' , ProjectImplementedRoutes.completeProject);


router.get("/project/changeProjectsVisibility/:id/:newValue" , ProjectImplementedRoutes.changeProjectsVisibility);
router.get("/project/changeOfferVisibility/:id/:newValue" , ProjectImplementedRoutes.changeOfferVisibility);
router.get("/project/changeAcceptedByCustomer/:id/:newValue" , ProjectImplementedRoutes.changeAcceptedByCustomer);
router.get("/project/changeCompletedByCustomer/:id/:newValue" , ProjectImplementedRoutes.changeCompletedByCustomer);
router.get("/project/customer/cancelProject/:id" , ProjectImplementedRoutes.cancelProjectCustomer);
router.get("/project/getFreeTags" , ProjectImplementedRoutes.getFreeTags);
router.get("/project/marketplace/getProjects" , ProjectImplementedRoutes.marketplaceGetProjects);
router.post("/project/applyFilters" , ProjectImplementedRoutes.applyFilters);
router.post("/project/insertOffer/:id" , ProjectImplementedRoutes.insertOffer);
router.get("/project/acceptOffer/:username/:projectTitle" , ProjectImplementedRoutes.acceptOffer);
router.get("/project/DeveloperCancellsOffer/:username/:projectTitle" , ProjectImplementedRoutes.DeveloperCancellsOffer);
router.get("/project/DeveloperCompletesOffer/:developerUsername/:projectTitle" , ProjectImplementedRoutes.DeveloperCompletesOffer);
router.get("/project/recommendDev/:developerUsername/:projectID", ProjectImplementedRoutes.recommendProject);
router.get("/project/viewDetails/:projectID" , ProjectImplementedRoutes.viewDetails);
router.get("/project/developer/completeProject/:projectID" , ProjectImplementedRoutes.devCompletedProject);
router.get("/project/customer/completeProject/:projectID" , ProjectImplementedRoutes.custCompletedProject);

module.exports = router;