const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const toppingRoutes = require('./routes/toppings');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/toppings', toppingRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database and start server
const initializeApp = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synchronized');
    
    // Seed initial toppings if needed
    const Topping = require('./models/Topping');
    const count = await Topping.count();
    if (count === 0) {
      await Topping.bulkCreate([
        { name: 'Cheese', price: 1.50 },
        { name: 'Pepperoni', price: 2.00 },
        { name: 'Mushrooms', price: 1.75 },
        { name: 'Onions', price: 1.25 },
        { name: 'Sausage', price: 2.25 },
        { name: 'Bacon', price: 2.50 },
        { name: 'Olives', price: 1.50 },
        { name: 'Green Peppers', price: 1.50 },
        { name: 'Pineapple', price: 1.75 },
        { name: 'Extra Cheese', price: 2.00 }
      ]);
      console.log('Initial toppings seeded');
    }
    
    app.listen(PORT, () => {
      console.log(`Pizza ordering server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to initialize application:', error);
    process.exit(1);
  }
};

initializeApp();
