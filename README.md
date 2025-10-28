# m2-webservices-pizza

Express JS pizza ordering application built with Sequelize ORM.

## Description

A full-stack web application that allows customers to order pizza with custom toppings and get it delivered to their home. No login is required. The application features:

- **Topping Selection**: Choose from 10 different toppings with real-time price updates
- **Dynamic Pricing**: Base pizza price ($8.00) + selected toppings + delivery fee ($5.00)
- **Address Input**: Enter delivery address with validation
- **Order Confirmation**: Simple checkout process without actual payment processing

## Technology Stack

- **Backend**: Express.js + Sequelize ORM + SQLite
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Database**: SQLite with auto-seeding

## Features

### Backend
- RESTful API endpoints
- Sequelize models for Topping and Order
- Input validation and security measures
- Automatic database initialization and seeding

### Frontend
- 4-step ordering process
- Responsive design with gradient UI
- Real-time price calculation
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

### Toppings

- `GET /api/toppings` - Get all available toppings
- `POST /api/toppings/calculate-price` - Calculate pizza price with selected toppings
  - Body: `{ "toppingIds": [1, 2, 3] }`

### Orders

- `POST /api/orders` - Create a new order
  - Body: `{ "toppingIds": [1, 2], "address": "123 Main St..." }`
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
│   ├── Order.js             # Order model
│   └── Topping.js           # Topping model
├── routes/
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

