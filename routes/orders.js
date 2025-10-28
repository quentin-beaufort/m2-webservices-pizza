import express from 'express';
import Order from '../models/Order.js';
import Topping from '../models/Topping.js';
import Pizza from '../models/Pizza.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const { sortBy = 'createdAt', sortOrder = 'DESC', status } = req.query;
    
    // Build where clause for filtering
    const whereClause = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    // Validate sort parameters
    const validSortFields = ['id', 'createdAt', 'totalPrice', 'status'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    
    // Fetch all orders with sorting and filtering
    const orders = await Order.findAll({
      where: whereClause,
      order: [[sortField, sortDirection]]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { toppingIds, address, basePizzaId } = req.body;

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
    if (!validIds && toppingIds.length > 0) {
      return res.status(400).json({ error: 'All topping IDs must be positive integers' });
    }

    const DELIVERY_FEE = 5.00;

    // Get base pizza
    let pizzaIdToUse = basePizzaId || 1; // Default to Margherita if not specified
    const pizzaId = parseInt(pizzaIdToUse, 10);
    if (!Number.isInteger(pizzaId) || pizzaId <= 0) {
      return res.status(400).json({ error: 'Invalid pizza ID' });
    }
    
    const pizza = await Pizza.findByPk(pizzaId);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }
    
    const basePrice = parseFloat(pizza.basePrice);
    const baseToppingIds = pizza.baseToppings || [];

    // Calculate additional toppings price (excluding base toppings)
    const additionalToppingIds = toppingIds.filter(id => !baseToppingIds.includes(id));
    let additionalToppingsPrice = 0;
    if (additionalToppingIds.length > 0) {
      const toppings = await Topping.findAll({
        where: { id: additionalToppingIds }
      });
      additionalToppingsPrice = toppings.reduce((sum, topping) => {
        return sum + parseFloat(topping.price);
      }, 0);
    }

    const pizzaPrice = basePrice + additionalToppingsPrice;
    const totalPrice = pizzaPrice + DELIVERY_FEE;

    // Create order
    const order = await Order.create({
      basePizzaId: pizzaId,
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

export default router;
