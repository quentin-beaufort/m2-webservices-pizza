// API base URL
const API_BASE = '/api';

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Application state
const state = {
    pizzas: [],
    toppings: [],
    selectedPizzaId: null,
    selectedToppingIds: [],
    address: '',
    orderId: null,
    pizzaPrice: 8.00,
    deliveryFee: 5.00
};

// DOM Elements
const sections = {
    pizza: document.getElementById('pizza-section'),
    toppings: document.getElementById('toppings-section'),
    address: document.getElementById('address-section'),
    checkout: document.getElementById('checkout-section'),
    confirmation: document.getElementById('confirmation-section')
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadToppings();
    await loadPizzas();
    setupEventListeners();
});

// Load pizzas from API
async function loadPizzas() {
    try {
        const response = await fetch(`${API_BASE}/pizzas`);
        if (!response.ok) throw new Error('Failed to load pizzas');
        
        state.pizzas = await response.json();
        renderPizzas();
    } catch (error) {
        console.error('Error loading pizzas:', error);
        alert('Failed to load pizzas. Please refresh the page.');
    }
}

// Load toppings from API
async function loadToppings() {
    try {
        const response = await fetch(`${API_BASE}/toppings`);
        if (!response.ok) throw new Error('Failed to load toppings');
        
        state.toppings = await response.json();
    } catch (error) {
        console.error('Error loading toppings:', error);
        alert('Failed to load toppings. Please refresh the page.');
    }
}

// Render pizzas list
function renderPizzas() {
    const pizzasList = document.getElementById('pizzas-list');
    pizzasList.innerHTML = '';
    
    state.pizzas.forEach(pizza => {
        const pizzaElement = document.createElement('div');
        pizzaElement.className = 'pizza-item';
        pizzaElement.dataset.id = pizza.id;
        
        if (state.selectedPizzaId === pizza.id) {
            pizzaElement.classList.add('selected');
        }
        
        // Get base topping names
        const baseToppingNames = pizza.baseToppings
            .map(id => {
                const topping = state.toppings.find(t => t.id === id);
                return topping ? topping.name : '';
            })
            .filter(name => name)
            .join(', ');
        
        pizzaElement.innerHTML = `
            <div class="pizza-name">${escapeHtml(pizza.name)}</div>
            <div class="pizza-description">${escapeHtml(pizza.description || '')}</div>
            <div class="pizza-toppings">Includes: ${escapeHtml(baseToppingNames)}</div>
            <div class="pizza-price">$${parseFloat(pizza.basePrice).toFixed(2)}</div>
        `;
        
        pizzaElement.addEventListener('click', () => selectPizza(pizza.id));
        pizzasList.appendChild(pizzaElement);
    });
}

// Select pizza
function selectPizza(pizzaId) {
    state.selectedPizzaId = pizzaId;
    
    // Get pizza and its base toppings
    const pizza = state.pizzas.find(p => p.id === pizzaId);
    if (pizza) {
        // Initialize selected toppings with base toppings
        state.selectedToppingIds = [...pizza.baseToppings];
    }
    
    renderPizzas();
}

// Render toppings list
function renderToppings() {
    const toppingsList = document.getElementById('toppings-list');
    toppingsList.innerHTML = '';
    
    // Get base toppings for selected pizza
    const pizza = state.pizzas.find(p => p.id === state.selectedPizzaId);
    const baseToppingIds = pizza ? pizza.baseToppings : [];
    
    state.toppings.forEach(topping => {
        const toppingElement = document.createElement('div');
        toppingElement.className = 'topping-item';
        toppingElement.dataset.id = topping.id;
        
        const isBaseTopping = baseToppingIds.includes(topping.id);
        const isSelected = state.selectedToppingIds.includes(topping.id);
        
        if (isBaseTopping) {
            toppingElement.classList.add('base-topping');
        }
        
        if (isSelected) {
            toppingElement.classList.add('selected');
        }
        
        const toppingLabel = isBaseTopping ? `${topping.name} (Included)` : topping.name;
        const toppingPrice = isBaseTopping ? 'Included' : `+$${parseFloat(topping.price).toFixed(2)}`;
        
        toppingElement.innerHTML = `
            <div class="topping-name">${escapeHtml(toppingLabel)}</div>
            <div class="topping-price">${toppingPrice}</div>
        `;
        
        if (!isBaseTopping) {
            toppingElement.addEventListener('click', () => toggleTopping(topping.id));
        }
        
        toppingsList.appendChild(toppingElement);
    });
    
    // Update selected pizza info
    if (pizza) {
        const pizzaInfo = document.getElementById('selected-pizza-info');
        const baseToppingNames = baseToppingIds
            .map(id => {
                const topping = state.toppings.find(t => t.id === id);
                return topping ? topping.name : '';
            })
            .filter(name => name)
            .join(', ');
        
        pizzaInfo.innerHTML = `
            <div class="selected-pizza-header">
                <strong>${escapeHtml(pizza.name)}</strong> - $${parseFloat(pizza.basePrice).toFixed(2)}
            </div>
            <div class="selected-pizza-base">Base toppings: ${escapeHtml(baseToppingNames)}</div>
        `;
    }
}

// Toggle topping selection
function toggleTopping(toppingId) {
    // Get base toppings for selected pizza
    const pizza = state.pizzas.find(p => p.id === state.selectedPizzaId);
    const baseToppingIds = pizza ? pizza.baseToppings : [];
    
    // Don't allow toggling base toppings
    if (baseToppingIds.includes(toppingId)) {
        return;
    }
    
    const index = state.selectedToppingIds.indexOf(toppingId);
    
    if (index > -1) {
        state.selectedToppingIds.splice(index, 1);
    } else {
        state.selectedToppingIds.push(toppingId);
    }
    
    renderToppings();
    updatePizzaPrice();
}

// Update pizza price
async function updatePizzaPrice() {
    try {
        const response = await fetch(`${API_BASE}/toppings/calculate-price`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                toppingIds: state.selectedToppingIds,
                basePizzaId: state.selectedPizzaId
            })
        });
        
        if (!response.ok) throw new Error('Failed to calculate price');
        
        const data = await response.json();
        state.pizzaPrice = parseFloat(data.totalPrice);
        
        document.getElementById('base-price').textContent = parseFloat(data.basePrice).toFixed(2);
        document.getElementById('toppings-price').textContent = parseFloat(data.toppingsPrice).toFixed(2);
        document.getElementById('pizza-total').textContent = data.totalPrice;
        document.getElementById('pizza-total-2').textContent = data.totalPrice;
        document.getElementById('pizza-total-3').textContent = data.totalPrice;
        
        updateTotalPrice();
    } catch (error) {
        console.error('Error calculating price:', error);
    }
}

// Update total price with delivery
function updateTotalPrice() {
    const total = state.pizzaPrice + state.deliveryFee;
    document.getElementById('order-total').textContent = total.toFixed(2);
    document.getElementById('order-total-3').textContent = total.toFixed(2);
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('next-to-toppings').addEventListener('click', () => {
        if (!state.selectedPizzaId) {
            alert('Please select a pizza first');
            return;
        }
        renderToppings();
        updatePizzaPrice();
        showSection('toppings');
    });
    
    document.getElementById('back-to-pizzas').addEventListener('click', () => {
        showSection('pizza');
    });
    
    document.getElementById('next-to-address').addEventListener('click', () => {
        showSection('address');
    });
    
    document.getElementById('back-to-toppings').addEventListener('click', () => {
        showSection('toppings');
    });
    
    document.getElementById('next-to-checkout').addEventListener('click', async () => {
        if (validateAddress()) {
            await createOrder();
            showSection('checkout');
        }
    });
    
    document.getElementById('back-to-address').addEventListener('click', () => {
        showSection('address');
    });
    
    document.getElementById('pay-button').addEventListener('click', async () => {
        await confirmOrder();
    });
    
    document.getElementById('new-order').addEventListener('click', () => {
        resetOrder();
        showSection('pizza');
    });
}

// Validate address
function validateAddress() {
    const addressInput = document.getElementById('address');
    const addressError = document.getElementById('address-error');
    const address = addressInput.value.trim();
    
    if (address === '') {
        addressError.textContent = 'Please enter a delivery address';
        addressError.classList.add('show');
        return false;
    }
    
    state.address = address;
    addressError.classList.remove('show');
    return true;
}

// Create order
async function createOrder() {
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                basePizzaId: state.selectedPizzaId,
                toppingIds: state.selectedToppingIds,
                address: state.address
            })
        });
        
        if (!response.ok) throw new Error('Failed to create order');
        
        const order = await response.json();
        state.orderId = order.id;
        
        renderOrderSummary();
    } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order. Please try again.');
    }
}

// Render order summary
function renderOrderSummary() {
    const orderDetails = document.getElementById('order-details');
    
    // Get pizza info
    const pizza = state.pizzas.find(p => p.id === state.selectedPizzaId);
    const pizzaName = pizza ? pizza.name : 'Unknown Pizza';
    const baseToppingIds = pizza ? pizza.baseToppings : [];
    
    // Get base toppings
    const baseToppings = state.toppings.filter(t => baseToppingIds.includes(t.id));
    const baseToppingsNames = baseToppings.map(t => escapeHtml(t.name)).join(', ');
    
    // Get additional toppings (selected but not base)
    const additionalToppingIds = state.selectedToppingIds.filter(id => !baseToppingIds.includes(id));
    const additionalToppings = state.toppings.filter(t => additionalToppingIds.includes(t.id));
    const additionalToppingsNames = additionalToppings.length > 0 
        ? additionalToppings.map(t => escapeHtml(t.name)).join(', ')
        : 'None';
    
    const escapedAddress = escapeHtml(state.address).replace(/\n/g, '<br>');
    
    orderDetails.innerHTML = `
        <div class="order-detail-item">
            <span class="order-detail-label">Pizza:</span> ${escapeHtml(pizzaName)}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Base Toppings:</span> ${baseToppingsNames}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Extra Toppings:</span> ${additionalToppingsNames}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Delivery Address:</span><br>
            ${escapedAddress}
        </div>
    `;
}

// Confirm order (payment)
async function confirmOrder() {
    if (!state.orderId) {
        alert('No order found. Please try again.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/orders/${state.orderId}/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Failed to confirm order');
        
        const data = await response.json();
        renderConfirmation(data.order);
        showSection('confirmation');
    } catch (error) {
        console.error('Error confirming order:', error);
        alert('Failed to confirm order. Please try again.');
    }
}

// Render confirmation
function renderConfirmation(order) {
    const confirmationDetails = document.getElementById('confirmation-details');
    
    // Get pizza info
    const pizza = state.pizzas.find(p => p.id === state.selectedPizzaId);
    const pizzaName = pizza ? pizza.name : 'Unknown Pizza';
    const baseToppingIds = pizza ? pizza.baseToppings : [];
    
    // Get base toppings
    const baseToppings = state.toppings.filter(t => baseToppingIds.includes(t.id));
    const baseToppingsNames = baseToppings.map(t => escapeHtml(t.name)).join(', ');
    
    // Get additional toppings (selected but not base)
    const additionalToppingIds = state.selectedToppingIds.filter(id => !baseToppingIds.includes(id));
    const additionalToppings = state.toppings.filter(t => additionalToppingIds.includes(t.id));
    const additionalToppingsNames = additionalToppings.length > 0 
        ? additionalToppings.map(t => escapeHtml(t.name)).join(', ')
        : 'None';
    
    const escapedAddress = escapeHtml(order.address).replace(/\n/g, '<br>');
    
    confirmationDetails.innerHTML = `
        <div class="order-detail-item">
            <span class="order-detail-label">Order #:</span> ${escapeHtml(String(order.id))}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Pizza:</span> ${escapeHtml(pizzaName)}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Base Toppings:</span> ${baseToppingsNames}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Extra Toppings:</span> ${additionalToppingsNames}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Delivery Address:</span><br>
            ${escapedAddress}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Total Paid:</span> $${parseFloat(order.totalPrice).toFixed(2)}
        </div>
    `;
}

// Show section
function showSection(sectionName) {
    Object.keys(sections).forEach(key => {
        sections[key].classList.remove('active');
    });
    sections[sectionName].classList.add('active');
}

// Reset order
function resetOrder() {
    state.selectedPizzaId = null;
    state.selectedToppingIds = [];
    state.address = '';
    state.orderId = null;
    state.pizzaPrice = 8.00;
    
    document.getElementById('address').value = '';
    renderPizzas();
}
