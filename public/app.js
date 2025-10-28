// API base URL
const API_BASE = '/api';

// Application state
const state = {
    toppings: [],
    selectedToppingIds: [],
    address: '',
    orderId: null,
    pizzaPrice: 8.00,
    deliveryFee: 5.00
};

// DOM Elements
const sections = {
    toppings: document.getElementById('toppings-section'),
    address: document.getElementById('address-section'),
    checkout: document.getElementById('checkout-section'),
    confirmation: document.getElementById('confirmation-section')
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadToppings();
    setupEventListeners();
});

// Load toppings from API
async function loadToppings() {
    try {
        const response = await fetch(`${API_BASE}/toppings`);
        if (!response.ok) throw new Error('Failed to load toppings');
        
        state.toppings = await response.json();
        renderToppings();
    } catch (error) {
        console.error('Error loading toppings:', error);
        alert('Failed to load toppings. Please refresh the page.');
    }
}

// Render toppings list
function renderToppings() {
    const toppingsList = document.getElementById('toppings-list');
    toppingsList.innerHTML = '';
    
    state.toppings.forEach(topping => {
        const toppingElement = document.createElement('div');
        toppingElement.className = 'topping-item';
        toppingElement.dataset.id = topping.id;
        
        if (state.selectedToppingIds.includes(topping.id)) {
            toppingElement.classList.add('selected');
        }
        
        toppingElement.innerHTML = `
            <div class="topping-name">${topping.name}</div>
            <div class="topping-price">+$${parseFloat(topping.price).toFixed(2)}</div>
        `;
        
        toppingElement.addEventListener('click', () => toggleTopping(topping.id));
        toppingsList.appendChild(toppingElement);
    });
}

// Toggle topping selection
function toggleTopping(toppingId) {
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
            body: JSON.stringify({ toppingIds: state.selectedToppingIds })
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
        showSection('toppings');
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
    const selectedToppings = state.toppings.filter(t => 
        state.selectedToppingIds.includes(t.id)
    );
    
    let toppingsHtml = '';
    if (selectedToppings.length > 0) {
        toppingsHtml = selectedToppings.map(t => t.name).join(', ');
    } else {
        toppingsHtml = 'No toppings (plain pizza)';
    }
    
    orderDetails.innerHTML = `
        <div class="order-detail-item">
            <span class="order-detail-label">Toppings:</span> ${toppingsHtml}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Delivery Address:</span><br>
            ${state.address.replace(/\n/g, '<br>')}
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
    const selectedToppings = state.toppings.filter(t => 
        state.selectedToppingIds.includes(t.id)
    );
    
    let toppingsHtml = '';
    if (selectedToppings.length > 0) {
        toppingsHtml = selectedToppings.map(t => t.name).join(', ');
    } else {
        toppingsHtml = 'No toppings (plain pizza)';
    }
    
    confirmationDetails.innerHTML = `
        <div class="order-detail-item">
            <span class="order-detail-label">Order #:</span> ${order.id}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Toppings:</span> ${toppingsHtml}
        </div>
        <div class="order-detail-item">
            <span class="order-detail-label">Delivery Address:</span><br>
            ${order.address.replace(/\n/g, '<br>')}
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
    state.selectedToppingIds = [];
    state.address = '';
    state.orderId = null;
    state.pizzaPrice = 8.00;
    
    document.getElementById('address').value = '';
    renderToppings();
    updatePizzaPrice();
}
