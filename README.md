# m2-webservices-pizza

Modern Pizza Ordering Progressive Web Application built with Vue.js 3, Vite, Express.js, and Sequelize ORM.

## Description

A full-stack Progressive Web Application (PWA) that allows customers to order pizza with custom toppings and get it delivered. The application features a modern Vue.js 3 frontend with offline support and a robust Express.js backend with SQLite database.

### Key Features

- **🍕 Customer Experience**
  - Base Pizza Selection: Choose from 6 different base pizzas (Margherita, Pepperoni, Four Cheese, Vegetarian, Hawaiian, Meat Lovers)
  - Base Toppings: Each pizza comes with its own set of included base toppings
  - Extra Topping Selection: Add extra toppings with real-time price updates
  - Dynamic Pricing: Base pizza price + extra toppings + delivery fee ($5.00)
  - Address Input: Enter delivery address with validation
  - Order Confirmation: Simple checkout process

- **👨‍💼 Admin Dashboard**
  - View all orders in a sortable, filterable table
  - Real-time statistics (total orders, revenue, etc.)
  - Sort by date, price, status, or ID
  - Filter by order status
  - View detailed order information
  - Password-protected access (default: `admin123`)
  - Responsive design for all devices

- **📱 Progressive Web App**
  - Installable on desktop and mobile devices
  - Offline support with service worker
  - Fast loading and smooth performance
  - Responsive design
  - App-like experience

## Technology Stack

### Frontend
- **Vue.js 3**: Modern reactive framework with Composition API
- **Vite**: Next-generation frontend tooling for fast development
- **Vue Router 4**: Official router for Vue.js with SPA navigation
- **Vite PWA Plugin**: Zero-config PWA support with Workbox

### Backend
- **Express.js 5**: Fast, unopinionated web framework
- **Sequelize ORM**: Promise-based Node.js ORM for SQLite
- **SQLite**: Lightweight, serverless database

### Development
- **ES Modules**: Modern JavaScript module system
- **Hot Module Replacement**: Instant updates during development
- **Service Workers**: Offline functionality and caching

## Prerequisites

- **Node.js**: v20.x or higher (LTS recommended)
- **npm**: v10.x or higher

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

## Development

The application runs two servers in development:
- **Backend (Express)**: Port 3000 - API server
- **Frontend (Vite)**: Port 5173 - Development server with HMR

### Start Backend Server
```bash
npm start
```
This starts the Express API server on http://localhost:3000

### Start Frontend Development Server
```bash
npm run dev
```
This starts the Vite dev server on http://localhost:5173 with hot reload.

### Access the Application
- **Frontend**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
- **API Endpoints**: http://localhost:3000/api

## Production Build

Build the Vue.js application for production:
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:
- Minified JavaScript and CSS
- Service worker for offline support
- PWA manifest
- Optimized assets

Start the production server:
```bash
NODE_ENV=production npm start
```

The Express server will serve the built application from the `dist/` directory.

## Project Structure

```
m2-webservices-pizza/
├── src/                        # Vue.js 3 source code
│   ├── components/            # Reusable Vue components
│   │   ├── admin/            # Admin dashboard components
│   │   │   ├── AdminDashboard.vue
│   │   │   ├── AdminLogin.vue
│   │   │   └── OrderModal.vue
│   │   ├── AddressForm.vue
│   │   ├── CheckoutView.vue
│   │   ├── ConfirmationView.vue
│   │   ├── PizzaSelection.vue
│   │   └── ToppingSelection.vue
│   ├── composables/          # Vue Composition API composables
│   │   ├── useAdmin.js       # Admin logic (auth, orders)
│   │   ├── useApi.js         # API client wrapper
│   │   └── usePizzaOrder.js  # Order flow state management
│   ├── views/                # Route-level components
│   │   ├── AdminView.vue     # Admin dashboard view
│   │   └── HomeView.vue      # Customer ordering view
│   ├── App.vue               # Root component
│   ├── main.js               # Application entry point
│   └── style.css             # Global styles
├── config/
│   └── database.js           # Sequelize configuration
├── models/
│   ├── Order.js              # Order model
│   ├── Pizza.js              # Pizza model
│   └── Topping.js            # Topping model
├── routes/
│   ├── orders.js             # Order routes (with admin endpoint)
│   ├── pizzas.js             # Pizza routes
│   └── toppings.js           # Topping routes
├── public/                   # Static assets (icons, etc.)
│   └── icons/               # SVG icons for UI and PWA
├── dist/                     # Production build output (generated)
├── index.html               # Entry HTML file for Vite
├── vite.config.js           # Vite configuration with PWA
├── server.js                # Express server
└── package.json             # Dependencies and scripts
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

- `GET /api/orders` - Get all orders (admin) with optional query params:
  - `sortBy`: Field to sort by (`id`, `createdAt`, `totalPrice`, `status`)
  - `sortOrder`: Sort direction (`ASC`, `DESC`)
  - `status`: Filter by status (`all`, `pending`, `confirmed`)
- `POST /api/orders` - Create a new order
  - Body: `{ "basePizzaId": 1, "toppingIds": [1, 2], "address": "123 Main St..." }`
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/:id/confirm` - Confirm order (payment)

## Architecture Overview

### Frontend Architecture (Vue.js 3)

The application follows a modular component-based architecture:

**Composables (Reusable Logic)**
- `useApi`: HTTP client wrapper for API calls
- `usePizzaOrder`: Order flow state management
- `useAdmin`: Admin dashboard logic and authentication

**Components**
- Single File Components (SFC) with Composition API
- Reusable UI components for each step
- Admin-specific components separated in subfolder

**Routing**
- Vue Router for SPA navigation
- Two main routes: `/` (customer) and `/admin`

### Backend Architecture (Express.js)

**Models (Sequelize ORM)**
- `Pizza`: Base pizzas with included toppings
- `Topping`: Available toppings with prices
- `Order`: Customer orders with status tracking

**Routes**
- RESTful API design
- Input validation and error handling
- Query parameters for filtering and sorting

**Database**
- SQLite for lightweight storage
- Auto-seeding on first run
- JSON storage for array fields (toppings)

### PWA Features

**Service Worker**
- Automatic caching of static assets
- Network-first strategy for API calls
- Offline fallback support

**Manifest**
- App icons (SVG and PNG)
- Standalone display mode
- Theme colors and branding

**Caching Strategy**
- Precache: HTML, CSS, JS, icons
- Runtime cache: API responses (5 min TTL)
- Font cache: Google Fonts (1 year TTL)

## Admin Dashboard

Access the admin dashboard at `/admin`:
- **Default Password**: `admin123`
- View all orders in a sortable, filterable table
- See real-time statistics
- View detailed order information
- Responsive design for all devices

📖 See [ADMIN_DOCUMENTATION.md](./ADMIN_DOCUMENTATION.md) for complete admin features documentation.

## Security

The application includes:
- XSS protection with HTML escaping
- Input validation for all API endpoints
- SQL injection prevention via Sequelize ORM
- Session-based admin authentication (client-side)

**Note**: For production use, consider implementing:
- Server-side authentication with JWT
- Rate limiting (e.g., with `express-rate-limit`)
- HTTPS enforcement
- Password hashing (bcrypt)
- CSRF protection
- Payment gateway integration

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant feedback during development. Changes to Vue components are reflected immediately without full page reload.

### Debugging
- Vue DevTools browser extension recommended
- API calls visible in browser Network tab
- Console logs for state changes in composables

### Database Reset
To reset the database:
```bash
rm database.sqlite
npm start  # Will recreate and reseed
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2015+ support required
- Service Workers support for PWA features

## Performance

- **First Load**: Optimized bundle splitting
- **Runtime**: Virtual DOM with Vue 3 reactivity
- **Caching**: Service worker for repeat visits
- **Bundle Size**: Tree-shaking with Vite

## Troubleshooting

### Port already in use
If port 3000 or 5173 is in use:
```bash
# Change port in server.js or vite.config.js
# Or kill the process using the port
```

### Node version issues
Make sure you're using Node.js v20 or higher:
```bash
node --version  # Should be v20.x or higher
nvm use 20      # If using nvm
```

### Database locked
If you see "database is locked":
```bash
# Close all connections to database.sqlite
# Or delete and recreate: rm database.sqlite && npm start
```

## License

ISC

