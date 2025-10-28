# m2-webservices-pizza

Express JS pizza ordering application built with Sequelize ORM.

## Description

A full-stack web application that allows customers to order pizza with custom toppings and get it delivered to their home. No login is required. The application features:

- **Base Pizza Selection**: Choose from 6 different base pizzas (Margherita, Pepperoni, Four Cheese, Vegetarian, Hawaiian, Meat Lovers)
- **Base Toppings**: Each pizza comes with its own set of included base toppings
- **Extra Topping Selection**: Add extra toppings on top of base toppings with real-time price updates
- **Dynamic Pricing**: Base pizza price + extra toppings + delivery fee ($5.00)
- **Address Input**: Enter delivery address with validation
- **Order Confirmation**: Simple checkout process without actual payment processing

## Technology Stack

- **Backend**: Express.js + Sequelize ORM + SQLite
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Database**: SQLite with auto-seeding

## Features

### Backend
- RESTful API endpoints
- Sequelize models for Pizza, Topping, and Order
- Input validation and security measures
- Automatic database initialization and seeding
- Support for base pizzas with pre-defined toppings

### Frontend
- 4-step ordering process:
  1. Select a base pizza
  2. Add extra toppings (optional)
  3. Enter delivery address
  4. Review and confirm order
- Responsive design with gradient UI
- Real-time price calculation
- Clear distinction between base and extra toppings
- Form validation
- Smooth animations and transitions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/quentin-beaufort/m2-webservices-pizza.git
cd m2-webservices-pizza
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Pizzas

- `GET /api/pizzas` - Get all available base pizzas
- `GET /api/pizzas/:id` - Get a specific pizza by ID

### Toppings

- `GET /api/toppings` - Get all available toppings
- `POST /api/toppings/calculate-price` - Calculate pizza price with selected toppings and base pizza
  - Body: `{ "basePizzaId": 1, "toppingIds": [1, 2, 3] }`

### Orders

- `POST /api/orders` - Create a new order
  - Body: `{ "basePizzaId": 1, "toppingIds": [1, 2], "address": "123 Main St..." }`
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/:id/confirm` - Confirm order (payment)

## Security

The application includes:
- XSS protection with HTML escaping
- Input validation for all API endpoints
- SQL injection prevention via Sequelize ORM

**Note**: For production use, consider implementing:
- Rate limiting (e.g., with `express-rate-limit`)
- Authentication and authorization
- HTTPS
- Payment gateway integration

## Project Structure

```
m2-webservices-pizza/
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── Pizza.js             # Pizza model
│   ├── Order.js             # Order model
│   └── Topping.js           # Topping model
├── routes/
│   ├── pizzas.js            # Pizza routes
│   ├── orders.js            # Order routes
│   └── toppings.js          # Topping routes
├── public/
│   ├── index.html           # Main HTML file
│   ├── styles.css           # Styles
│   └── app.js               # Frontend JavaScript
├── server.js                # Express server
├── package.json             # Dependencies
└── README.md                # This file
```

## License

ISC

