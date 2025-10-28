const express = require('express');
const router = express.Router();
const Topping = require('../models/Topping');

// Get all toppings
router.get('/', async (req, res) => {
  try {
    const toppings = await Topping.findAll({
      order: [['name', 'ASC']]
    });
    res.json(toppings);
  } catch (error) {
    console.error('Error fetching toppings:', error);
    res.status(500).json({ error: 'Failed to fetch toppings' });
  }
});

// Calculate price for selected toppings
router.post('/calculate-price', async (req, res) => {
  try {
    const { toppingIds } = req.body;
    
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

    const BASE_PRICE = 8.00; // Base pizza price
    
    if (toppingIds.length === 0) {
      return res.json({ 
        basePrice: BASE_PRICE,
        toppingsPrice: 0,
        totalPrice: BASE_PRICE 
      });
    }

    const toppings = await Topping.findAll({
      where: { id: toppingIds }
    });

    const toppingsPrice = toppings.reduce((sum, topping) => {
      return sum + parseFloat(topping.price);
    }, 0);

    const totalPrice = BASE_PRICE + toppingsPrice;

    res.json({
      basePrice: BASE_PRICE,
      toppingsPrice: toppingsPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
});

module.exports = router;
