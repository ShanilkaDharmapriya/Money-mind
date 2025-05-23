const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController.js');

const router = express.Router();

router.get('/', authMiddleware, getDashboard);

module.exports = router;
