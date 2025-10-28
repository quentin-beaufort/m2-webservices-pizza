import { ref, computed } from 'vue';
import { useApi } from './useApi';

export function useAdmin() {
  const api = useApi();
  
  // State
  const isAuthenticated = ref(false);
  const orders = ref([]);
  const pizzas = ref([]);
  const toppings = ref([]);
  const selectedOrder = ref(null);
  const currentFilter = ref('all');
  const currentSort = ref('createdAt');
  const currentSortOrder = ref('DESC');

  // Check authentication on init
  if (typeof window !== 'undefined') {
    isAuthenticated.value = sessionStorage.getItem('adminAuth') === 'true';
  }

  // Computed
  const stats = computed(() => {
    const total = orders.value.length;
    const pending = orders.value.filter(o => o.status === 'pending').length;
    const confirmed = orders.value.filter(o => o.status === 'confirmed').length;
    const revenue = orders.value
      .filter(o => o.status === 'confirmed')
      .reduce((sum, o) => sum + parseFloat(o.totalPrice), 0);
    
    return { total, pending, confirmed, revenue };
  });

  // Methods
  const login = (password) => {
    if (password === 'admin123') {
      isAuthenticated.value = true;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminAuth', 'true');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    isAuthenticated.value = false;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminAuth');
    }
  };

  const loadPizzas = async () => {
    try {
      pizzas.value = await api.get('/pizzas');
    } catch (error) {
      console.error('Error loading pizzas:', error);
    }
  };

  const loadToppings = async () => {
    try {
      toppings.value = await api.get('/toppings');
    } catch (error) {
      console.error('Error loading toppings:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams({
        sortBy: currentSort.value,
        sortOrder: currentSortOrder.value
      });

      if (currentFilter.value !== 'all') {
        params.append('status', currentFilter.value);
      }

      orders.value = await api.get(`/orders?${params.toString()}`);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const setFilter = (filter) => {
    currentFilter.value = filter;
  };

  const setSort = (sort) => {
    // Parse sort string (e.g., "createdAt" or "createdAt-asc")
    if (sort.includes('-asc')) {
      currentSort.value = sort.replace('-asc', '');
      currentSortOrder.value = 'ASC';
    } else {
      currentSort.value = sort;
      currentSortOrder.value = 'DESC';
    }
  };

  const selectOrder = (order) => {
    selectedOrder.value = order;
  };

  const closeOrderModal = () => {
    selectedOrder.value = null;
  };

  const getPizzaName = (pizzaId) => {
    const pizza = pizzas.value.find(p => p.id === pizzaId);
    return pizza ? pizza.name : 'Unknown Pizza';
  };

  const getToppingNames = (toppingIds) => {
    return toppingIds
      .map(id => {
        const topping = toppings.value.find(t => t.id === id);
        return topping ? topping.name : '';
      })
      .filter(name => name)
      .join(', ');
  };

  return {
    // State
    isAuthenticated,
    orders,
    pizzas,
    toppings,
    selectedOrder,
    currentFilter,
    currentSort,
    loading: api.loading,
    error: api.error,
    
    // Computed
    stats,
    
    // Methods
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
  };
}
