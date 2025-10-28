import { ref, computed } from 'vue';
import { useApi } from './useApi';

export function usePizzaOrder() {
  const api = useApi();
  
  // State
  const pizzas = ref([]);
  const toppings = ref([]);
  const selectedPizzaId = ref(null);
  const selectedToppingIds = ref([]);
  const address = ref('');
  const orderId = ref(null);
  const pizzaPrice = ref(8.00);
  const deliveryFee = ref(5.00);
  const currentStep = ref(1);

  // Computed
  const selectedPizza = computed(() => 
    pizzas.value.find(p => p.id === selectedPizzaId.value)
  );

  const baseToppingIds = computed(() => 
    selectedPizza.value?.baseToppings || []
  );

  const extraToppingIds = computed(() =>
    selectedToppingIds.value.filter(id => !baseToppingIds.value.includes(id))
  );

  const totalPrice = computed(() => 
    pizzaPrice.value + deliveryFee.value
  );

  // Methods
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

  const selectPizza = (pizzaId) => {
    selectedPizzaId.value = pizzaId;
    const pizza = pizzas.value.find(p => p.id === pizzaId);
    if (pizza) {
      selectedToppingIds.value = [...pizza.baseToppings];
    }
  };

  const toggleTopping = (toppingId) => {
    if (baseToppingIds.value.includes(toppingId)) {
      return; // Can't toggle base toppings
    }

    const index = selectedToppingIds.value.indexOf(toppingId);
    if (index > -1) {
      selectedToppingIds.value.splice(index, 1);
    } else {
      selectedToppingIds.value.push(toppingId);
    }
  };

  const updatePizzaPrice = async () => {
    try {
      const data = await api.post('/toppings/calculate-price', {
        toppingIds: selectedToppingIds.value,
        basePizzaId: selectedPizzaId.value
      });
      pizzaPrice.value = parseFloat(data.totalPrice);
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const createOrder = async () => {
    try {
      const order = await api.post('/orders', {
        basePizzaId: selectedPizzaId.value,
        toppingIds: selectedToppingIds.value,
        address: address.value
      });
      orderId.value = order.id;
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const confirmOrder = async () => {
    try {
      const data = await api.post(`/orders/${orderId.value}/confirm`, {});
      return data.order;
    } catch (error) {
      console.error('Error confirming order:', error);
      throw error;
    }
  };

  const resetOrder = () => {
    selectedPizzaId.value = null;
    selectedToppingIds.value = [];
    address.value = '';
    orderId.value = null;
    pizzaPrice.value = 8.00;
    currentStep.value = 1;
  };

  const nextStep = () => {
    if (currentStep.value < 5) {
      currentStep.value++;
    }
  };

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  const goToStep = (step) => {
    currentStep.value = step;
  };

  return {
    // State
    pizzas,
    toppings,
    selectedPizzaId,
    selectedToppingIds,
    address,
    orderId,
    pizzaPrice,
    deliveryFee,
    currentStep,
    loading: api.loading,
    error: api.error,
    
    // Computed
    selectedPizza,
    baseToppingIds,
    extraToppingIds,
    totalPrice,
    
    // Methods
    loadPizzas,
    loadToppings,
    selectPizza,
    toggleTopping,
    updatePizzaPrice,
    createOrder,
    confirmOrder,
    resetOrder,
    nextStep,
    prevStep,
    goToStep
  };
}
