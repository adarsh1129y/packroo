const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create new product - Admin only
router.post('/', [protect, admin], productController.createProduct);

// Update product - Admin only
router.put('/:id', [protect, admin], productController.updateProduct);

// Delete product - Admin only
router.delete('/:id', [protect, admin], productController.deleteProduct);

module.exports = router;
