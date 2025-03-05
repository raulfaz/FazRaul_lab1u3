const express = require('express');
const router = express.Router();
const discountsController = require('../controllers/discountsController');
const { validateDiscount } = require('../middleware/discountMiddleware');

router.get('/', discountsController.getAllDiscounts);
router.post('/', validateDiscount, discountsController.createDiscount);
router.put('/:id', validateDiscount, discountsController.updateDiscount);
router.delete('/:id', discountsController.deleteDiscount);

module.exports = router;