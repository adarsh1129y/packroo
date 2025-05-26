import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../services/orderService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new order
router.post('/', protect, async (req, res) => {
    try {
        const orderId = await createOrder({
            userId: req.user.id,
            items: req.body.items,
            total: req.body.total,
            deliveryAddress: req.body.deliveryAddress
        });
        res.status(201).json({ orderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's orders
router.get('/', protect, async (req, res) => {
    try {
        const orders = await getOrders(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin route to update order status
router.put('/:orderId/status', protect, async (req, res) => {
    try {
        // Add admin check here
        await updateOrderStatus(req.params.orderId, req.body.status);
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
