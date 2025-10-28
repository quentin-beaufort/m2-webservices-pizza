<template>
  <div class="container">
    <header>
      <div class="header-content">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-large">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        </div>
        <h1>Admin Dashboard</h1>
        <p>Manage and monitor all pizza orders</p>
        <nav class="header-nav">
          <router-link to="/" class="home-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-small">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Back to App
          </router-link>
          <button v-if="isAuthenticated" class="btn btn-secondary" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-small">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            Logout
          </button>
        </nav>
      </div>
    </header>

    <!-- Authentication Section -->
    <section v-if="!isAuthenticated" class="section">
      <AdminLogin @login="handleLogin" />
    </section>

    <!-- Dashboard Section -->
    <section v-else class="section">
      <AdminDashboard
        :orders="orders"
        :pizzas="pizzas"
        :toppings="toppings"
        :stats="stats"
        :loading="loading"
        :current-filter="currentFilter"
        :current-sort="currentSort"
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
        @refresh="handleRefresh"
        @view-order="handleViewOrder"
      />
    </section>

    <!-- Order Details Modal -->
    <OrderModal
      v-if="selectedOrder"
      :order="selectedOrder"
      :pizza-name="getPizzaName(selectedOrder.basePizzaId)"
      :topping-names="getToppingNames(selectedOrder.toppingIds)"
      :base-topping-names="getBaseToppingNames(selectedOrder)"
      @close="closeOrderModal"
    />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useAdmin } from '@/composables/useAdmin';
import AdminLogin from '@/components/admin/AdminLogin.vue';
import AdminDashboard from '@/components/admin/AdminDashboard.vue';
import OrderModal from '@/components/admin/OrderModal.vue';

const {
  isAuthenticated,
  orders,
  pizzas,
  toppings,
  selectedOrder,
  currentFilter,
  currentSort,
  stats,
  loading,
  login,
  logout,
  loadPizzas,
  loadToppings,
  loadOrders,
  setFilter,
  setSort,
  selectOrder,
  closeOrderModal,
  getPizzaName,
  getToppingNames
} = useAdmin();

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadPizzas();
    await loadToppings();
    await loadOrders();
  }
});

watch(isAuthenticated, async (newValue) => {
  if (newValue) {
    await loadPizzas();
    await loadToppings();
    await loadOrders();
  }
});

const handleLogin = async (password) => {
  const success = login(password);
  if (!success) {
    alert('Invalid password');
  }
};

const handleLogout = () => {
  logout();
};

const handleFilterChange = async (filter) => {
  setFilter(filter);
  await loadOrders();
};

const handleSortChange = async (sort) => {
  setSort(sort);
  await loadOrders();
};

const handleRefresh = async () => {
  await loadOrders();
};

const handleViewOrder = (order) => {
  selectOrder(order);
};

const getBaseToppingNames = (order) => {
  const pizza = pizzas.value.find(p => p.id === order.basePizzaId);
  if (!pizza) return '';
  return getToppingNames(pizza.baseToppings);
};
</script>
