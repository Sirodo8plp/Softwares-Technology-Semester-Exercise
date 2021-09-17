const AdminImplementedRoutes = require("../controllers/AdminImplementedRoutes");
const express = require('express');
const router = express.Router();

router.get('/admin/general' , AdminImplementedRoutes.general);
router.get('/admin/customers' , AdminImplementedRoutes.customers);
router.get("/admin/getCustomers" , AdminImplementedRoutes.getCustomers);
router.get("/admin/deleteCustomer/:customerID" ,AdminImplementedRoutes.deleteCustomer);
router.get("/admin/developers" , AdminImplementedRoutes.developers);
router.get("/admin/GetDevelopers" , AdminImplementedRoutes.getDevelopers);
router.get("/admin/deleteDeveloper/:developerID" , AdminImplementedRoutes.deleteDeveloper);
router.get("/admin/projects" , AdminImplementedRoutes.projects);
router.get("/admin/getProjects" , AdminImplementedRoutes.getProjects);
router.get("/admin/deleteProject/:projectID" , AdminImplementedRoutes.deleteProject);

module.exports = router;