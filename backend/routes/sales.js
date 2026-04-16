const express = require('express');
const auth = require('../middleware/auth');
const { checkout, getSales, getReport } = require('../controllers/salesController');

const router = express.Router();
router.use(auth);
router.post('/checkout', checkout);
router.get('/', getSales);
router.get('/report', getReport);

module.exports = router;
