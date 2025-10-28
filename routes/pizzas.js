import express from 'express';
import Pizza from '../models/Pizza.js';

const router = express.Router();

// Get all pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.findAll({
      order: [['name', 'ASC']]
    });
    res.json(pizzas);
  } catch (error) {
    console.error('Error fetching pizzas:', error);
    res.status(500).json({ error: 'Failed to fetch pizzas' });
  }
});

// Get pizza by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that ID is a positive integer
    const pizzaId = parseInt(id, 10);
    if (!Number.isInteger(pizzaId) || pizzaId <= 0) {
      return res.status(400).json({ error: 'Invalid pizza ID' });
    }
    
    const pizza = await Pizza.findByPk(pizzaId);

    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }

    res.json(pizza);
  } catch (error) {
    console.error('Error fetching pizza:', error);
    res.status(500).json({ error: 'Failed to fetch pizza' });
  }
});

export default router;
