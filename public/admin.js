// API base URL
const API_BASE = '/api';

// Admin password (in production, this should be handled server-side)
const ADMIN_PASSWORD = 'admin123';

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Application state
const state = {
    orders: [],
    pizzas: [],
    toppings: [],
    isAuthenticated: false,
    currentFilter: 'all',
    currentSort: 'createdAt',
    currentSortOrder: 'DESC'
};

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const authError = document.getElementById('auth-error');
const filterStatus = document.getElementById('filter-status');
const sortBy = document.getElementById('sort-by');
const refreshBtn = document.getElementById('refresh-btn');
const logoutBtn = document.getElementById('logout-btn');
const ordersTable = document.getElementById('orders-tbody');
const loadingMessage = document.getElementById('loading-message');
const emptyMessage = document.getElementById('empty-message');
const orderModal = document.getElementById('order-modal');
const closeModal = document.getElementById('close-modal');

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Check if already authenticated
    const savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
        state.isAuthenticated = true;
        showDashboard();
        await initializeDashboard();
    }
    
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    filterStatus.addEventListener('change', handleFilterChange);
    sortBy.addEventListener('change', handleSortChange);
    refreshBtn.addEventListener('click', loadOrders);
    closeModal.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    if (password === ADMIN_PASSWORD) {
        state.isAuthenticated = true;
        sessionStorage.setItem('adminAuth', 'true');
        authError.textContent = '';
        authError.classList.remove('show');
        showDashboard();
        initializeDashboard();
    } else {
        authError.textContent = 'Invalid password. Please try again.';
        authError.classList.add('show');
    }
}

// Handle logout
function handleLogout() {
    state.isAuthenticated = false;
    sessionStorage.removeItem('adminAuth');
    authSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    document.getElementById('admin-password').value = '';
}

// Show dashboard
function showDashboard() {
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';
}

// Initialize dashboard
async function initializeDashboard() {
    await loadPizzas();
    await loadToppings();
    await loadOrders();
}

// Load pizzas from API
async function loadPizzas() {
    try {
        const response = await fetch(`${API_BASE}/pizzas`);
        if (!response.ok) throw new Error('Failed to load pizzas');
        state.pizzas = await response.json();
    } catch (error) {
        console.error('Error loading pizzas:', error);
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
    }
}

// Load orders from API
async function loadOrders() {
    try {
        loadingMessage.style.display = 'flex';
        emptyMessage.style.display = 'none';
        ordersTable.innerHTML = '';
        
        // Build query parameters
        const params = new URLSearchParams({
            sortBy: state.currentSort,
            sortOrder: state.currentSortOrder,
            status: state.currentFilter
        });
        
        const response = await fetch(`${API_BASE}/orders?${params}`);
        if (!response.ok) throw new Error('Failed to load orders');
        
        state.orders = await response.json();
        
        loadingMessage.style.display = 'none';
        
        if (state.orders.length === 0) {
            emptyMessage.style.display = 'flex';
        } else {
            renderOrders();
            updateStats();
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        loadingMessage.style.display = 'none';
        alert('Failed to load orders. Please try again.');
    }
}

// Render orders table
function renderOrders() {
    ordersTable.innerHTML = '';
    
    state.orders.forEach(order => {
        const row = document.createElement('tr');
        row.className = `order-row status-${order.status}`;
        
        // Get pizza name
        const pizza = state.pizzas.find(p => p.id === order.basePizzaId);
        const pizzaName = pizza ? pizza.name : 'Unknown Pizza';
        
        // Get toppings names
        const toppingNames = order.toppings
            .map(id => {
                const topping = state.toppings.find(t => t.id === id);
                return topping ? topping.name : '';
            })
            .filter(name => name)
            .join(', ');
        
        // Format date
        const orderDate = new Date(order.createdAt);
        const dateStr = orderDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        const timeStr = orderDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Truncate address for table display
        const shortAddress = order.address.length > 30 
            ? order.address.substring(0, 30) + '...' 
            : order.address;
        
        // Status badge
        const statusBadge = `<span class="status-badge status-${order.status}">${order.status}</span>`;
        
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>
                <div class="date-cell">
                    <div>${escapeHtml(dateStr)}</div>
                    <div class="time-cell">${escapeHtml(timeStr)}</div>
                </div>
            </td>
            <td title="${escapeHtml(order.address)}">${escapeHtml(shortAddress)}</td>
            <td>${escapeHtml(pizzaName)}</td>
            <td class="toppings-cell" title="${escapeHtml(toppingNames)}">${escapeHtml(toppingNames || 'Base only')}</td>
            <td class="price-cell">$${parseFloat(order.totalPrice).toFixed(2)}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn-view" onclick="viewOrderDetails(${order.id})">
                    👁️ View Details
                </button>
            </td>
        `;
        
        ordersTable.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    const totalOrders = state.orders.length;
    const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
    const confirmedOrders = state.orders.filter(o => o.status === 'confirmed').length;
    const totalRevenue = state.orders
        .filter(o => o.status === 'confirmed')
        .reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
    
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('confirmed-orders').textContent = confirmedOrders;
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

// Handle filter change
function handleFilterChange() {
    state.currentFilter = filterStatus.value;
    loadOrders();
}

// Handle sort change
function handleSortChange() {
    const value = sortBy.value;
    const [field, order] = value.split('-');
    
    state.currentSort = field;
    state.currentSortOrder = order === 'asc' ? 'ASC' : 'DESC';
    
    loadOrders();
}

// View order details (global function for onclick)
window.viewOrderDetails = async function(orderId) {
    try {
        const order = state.orders.find(o => o.id === orderId);
        if (!order) {
            alert('Order not found');
            return;
        }
        
        // Get pizza info
        const pizza = state.pizzas.find(p => p.id === order.basePizzaId);
        const pizzaName = pizza ? pizza.name : 'Unknown Pizza';
        const baseToppingIds = pizza ? pizza.baseToppings : [];
        
        // Get base toppings
        const baseToppings = state.toppings.filter(t => baseToppingIds.includes(t.id));
        const baseToppingsNames = baseToppings.map(t => escapeHtml(t.name)).join(', ');
        
        // Get additional toppings
        const additionalToppingIds = order.toppings.filter(id => !baseToppingIds.includes(id));
        const additionalToppings = state.toppings.filter(t => additionalToppingIds.includes(t.id));
        const additionalToppingsNames = additionalToppings.length > 0 
            ? additionalToppings.map(t => escapeHtml(t.name)).join(', ')
            : 'None';
        
        // Format date
        const orderDate = new Date(order.createdAt);
        const fullDateStr = orderDate.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const escapedAddress = escapeHtml(order.address).replace(/\n/g, '<br>');
        const statusClass = order.status === 'confirmed' ? 'confirmed' : 'pending';
        
        const modalContent = document.getElementById('order-details-content');
        modalContent.innerHTML = `
            <div class="order-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">#${order.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge status-${order.status}">${order.status}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Order Date & Time:</span>
                    <span class="detail-value">${escapeHtml(fullDateStr)}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Pizza:</span>
                    <span class="detail-value">${escapeHtml(pizzaName)}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Base Toppings:</span>
                    <span class="detail-value">${baseToppingsNames}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Extra Toppings:</span>
                    <span class="detail-value">${additionalToppingsNames}</span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Delivery Address:</span>
                    <span class="detail-value">${escapedAddress}</span>
                </div>
                <div class="price-breakdown">
                    <div class="price-row">
                        <span>Pizza Price:</span>
                        <span>$${parseFloat(order.pizzaPrice).toFixed(2)}</span>
                    </div>
                    <div class="price-row">
                        <span>Delivery Fee:</span>
                        <span>$${parseFloat(order.deliveryFee).toFixed(2)}</span>
                    </div>
                    <div class="price-row total">
                        <span>Total Price:</span>
                        <span>$${parseFloat(order.totalPrice).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        
        orderModal.style.display = 'flex';
    } catch (error) {
        console.error('Error viewing order details:', error);
        alert('Failed to load order details');
    }
};
