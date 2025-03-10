const express = require('express');
const { convertCurrency } = require('../controllers/currencyController');
const {authMiddleware}=require('../middleware/authMiddleware')

const router = express.Router();

// ✅ Convert Amount Between Currencies
router.post('/convert',authMiddleware, convertCurrency);

module.exports = router;
