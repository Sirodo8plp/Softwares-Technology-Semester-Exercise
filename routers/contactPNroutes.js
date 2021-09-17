const ContactRoutes = require('../controllers/contactPNimplementedRoutes');
const express = require('express');
const router = express.Router();

router.post('/appendUserContactMessage' , ContactRoutes.append);
router.get('/contact/success' , ContactRoutes.success);

module.exports = router;