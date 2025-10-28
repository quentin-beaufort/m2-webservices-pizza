const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Topping = require('../models/Topping');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { toppingIds, address } = req.body;

    if (!address || address.trim() === '') {
      return res.status(400).json({ error: 'Address is required' });
    }

    if (!Array.isArray(toppingIds)) {
      return res.status(400).json({ error: 'toppingIds must be an array' });
    }

    // Validate that all toppingIds are positive integers
    const validIds = toppingIds.every(id => 
      Number.isInteger(id) && id > 0
    );
    if (!validIds) {
      return res.status(400).json({ error: 'All topping IDs must be positive integers' });
    }

    const BASE_PRICE = 8.00;
    const DELIVERY_FEE = 5.00;

    // Calculate pizza price
    let toppingsPrice = 0;
    if (toppingIds.length > 0) {
      const toppings = await Topping.findAll({
        where: { id: toppingIds }
      });
      toppingsPrice = toppings.reduce((sum, topping) => {
        return sum + parseFloat(topping.price);
      }, 0);
    }

    const pizzaPrice = BASE_PRICE + toppingsPrice;
    const totalPrice = pizzaPrice + DELIVERY_FEE;

    // Create order
    const order = await Order.create({
      toppings: toppingIds,
      address: address.trim(),
      pizzaPrice: pizzaPrice.toFixed(2),
      deliveryFee: DELIVERY_FEE.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Confirm order (payment)
router.post('/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that ID is a positive integer
    const orderId = parseInt(id, 10);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'confirmed') {
      return res.status(400).json({ error: 'Order already confirmed' });
    }

    order.status = 'confirmed';
    await order.save();

    res.json({
      message: 'Order confirmed successfully!',
      order
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ error: 'Failed to confirm order' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that ID is a positive integer
    const orderId = parseInt(id, 10);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
