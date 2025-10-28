import express from 'express';
import Topping from '../models/Topping.js';
import Pizza from '../models/Pizza.js';

const router = express.Router();

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
    const { toppingIds, basePizzaId } = req.body;
    
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

    // Get base pizza if specified, otherwise use default
    let basePrice = 8.00;
    let baseToppingIds = [];
    
    if (basePizzaId) {
      const pizzaId = parseInt(basePizzaId, 10);
      if (!Number.isInteger(pizzaId) || pizzaId <= 0) {
        return res.status(400).json({ error: 'Invalid pizza ID' });
      }
      
      const pizza = await Pizza.findByPk(pizzaId);
      if (!pizza) {
        return res.status(404).json({ error: 'Pizza not found' });
      }
      
      basePrice = parseFloat(pizza.basePrice);
      baseToppingIds = pizza.baseToppings || [];
    }
    
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

    const totalPrice = basePrice + additionalToppingsPrice;

    res.json({
      basePrice: basePrice.toFixed(2),
      toppingsPrice: additionalToppingsPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
});

export default router;
