const homeRoutes = require('../controllers/homeImplementedRoutes');
const express = require('express');
const router = express.Router();

router.get('/' , homeRoutes.home);
router.get('/loginPage' , homeRoutes.loginPage);
router.get('/contactProjectsNest' , homeRoutes.contact);
router.get('/about' , homeRoutes.about);
router.get("/home/marketplace" , homeRoutes.marketplace);
router.get("/home/profile" , homeRoutes.profile);
router.get("/home/customizeNavbar" , homeRoutes.findWhoIsWho);
router.get("/home/searchAsync/:inputValue" , homeRoutes.searchAsync);
router.get("/home/visitCustomer/:username" , homeRoutes.visitCustomer);
router.get("/home/visitDeveloper/:username" , homeRoutes.visitDeveloper);
router.get("/home/marketplace/getDevelopers/:inputValue" , homeRoutes.getDevelopers);
router.get("/home/commentDev" , homeRoutes.commentDev);
router.get("/home/people" , homeRoutes.viewPeople);
router.get("/home/people/getDevelopers" , homeRoutes.peopleGetDevelopers);
router.get("/home/people/getCustomers" , homeRoutes.peopleGetCustomers);
router.post("/home/filterDevelopers" , homeRoutes.filter);

module.exports = router;