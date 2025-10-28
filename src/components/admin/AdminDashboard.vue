<template>
  <div>
    <div class="controls-bar">
      <div class="control-group">
        <label for="filter-status">Filter by Status:</label>
        <select
          id="filter-status"
          :value="currentFilter"
          @change="$emit('filter-change', $event.target.value)"
          class="form-control"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
        </select>
      </div>

      <div class="control-group">
        <label for="sort-by">Sort By:</label>
        <select
          id="sort-by"
          :value="currentSort"
          @change="$emit('sort-change', $event.target.value)"
          class="form-control"
        >
          <option value="createdAt">Date (Newest First)</option>
          <option value="createdAt-asc">Date (Oldest First)</option>
          <option value="totalPrice">Price (High to Low)</option>
          <option value="totalPrice-asc">Price (Low to High)</option>
          <option value="id">Order ID</option>
          <option value="status">Status</option>
        </select>
      </div>

      <button class="btn btn-primary" @click="$emit('refresh')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-small">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Refresh
      </button>
    </div>

    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-label">Total Orders</div>
        <div class="stat-value">{{ stats.total }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pending</div>
        <div class="stat-value pending">{{ stats.pending }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Confirmed</div>
        <div class="stat-value confirmed">{{ stats.confirmed }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value revenue">${{ stats.revenue.toFixed(2) }}</div>
      </div>
    </div>

    <div class="table-container">
      <div v-if="loading" class="loading-message">
        <div class="spinner"></div>
        <p>Loading orders...</p>
      </div>
      
      <div v-else-if="orders.length === 0" class="empty-message">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-empty">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <p>No orders found</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date & Time</th>
            <th>Customer Address</th>
            <th>Pizza</th>
            <th>Toppings</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>{{ truncateAddress(order.address) }}</td>
            <td>{{ getPizzaName(order.basePizzaId) }}</td>
            <td>{{ getToppingCount(order.toppingIds) }} toppings</td>
            <td>${{ parseFloat(order.totalPrice).toFixed(2) }}</td>
            <td>
              <span class="status-badge" :class="`status-${order.status}`">
                {{ order.status }}
              </span>
            </td>
            <td>
              <button class="btn btn-secondary" @click="$emit('view-order', order)">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  orders: {
    type: Array,
    required: true
  },
  pizzas: {
    type: Array,
    required: true
  },
  toppings: {
    type: Array,
    required: true
  },
  stats: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentFilter: {
    type: String,
    required: true
  },
  currentSort: {
    type: String,
    required: true
  }
});

defineEmits(['filter-change', 'sort-change', 'refresh', 'view-order']);

const getPizzaName = (pizzaId) => {
  const pizza = props.pizzas.find(p => p.id === pizzaId);
  return pizza ? pizza.name : 'Unknown';
};

const getToppingCount = (toppingIds) => {
  return toppingIds ? toppingIds.length : 0;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const truncateAddress = (address) => {
  if (!address) return '';
  const firstLine = address.split('\n')[0];
  return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
};
</script>
