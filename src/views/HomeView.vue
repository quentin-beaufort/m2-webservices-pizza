<template>
  <div class="container">
    <header>
      <div class="header-content">
        <div class="header-icon">
          <img src="/icons/pizza.svg" alt="Pizza" class="icon-large" />
        </div>
        <h1>Pizza Ordering</h1>
        <p>Build your perfect pizza and get it delivered to your door!</p>
        <div class="header-nav">
          <router-link to="/admin" class="admin-link">
            <img src="/icons/shield-lock.svg" alt="Admin" class="icon-small" />
            Admin Access
          </router-link>
        </div>
      </div>
    </header>

    <!-- Step 1: Choose Pizza -->
    <section v-if="currentStep === 1" class="section">
      <PizzaSelection
        :pizzas="pizzas"
        :toppings="toppings"
        :selected-pizza-id="selectedPizzaId"
        @select-pizza="selectPizza"
        @next="goToToppings"
      />
    </section>

    <!-- Step 2: Choose Extra Toppings -->
    <section v-if="currentStep === 2" class="section">
      <ToppingSelection
        :pizza="selectedPizza"
        :toppings="toppings"
        :selected-topping-ids="selectedToppingIds"
        :base-topping-ids="baseToppingIds"
        :pizza-price="pizzaPrice"
        :delivery-fee="deliveryFee"
        @toggle-topping="toggleTopping"
        @back="prevStep"
        @next="nextStep"
      />
    </section>

    <!-- Step 3: Enter Address -->
    <section v-if="currentStep === 3" class="section">
      <AddressForm
        v-model="address"
        :pizza-price="pizzaPrice"
        :delivery-fee="deliveryFee"
        :total-price="totalPrice"
        @back="prevStep"
        @next="goToCheckout"
      />
    </section>

    <!-- Step 4: Checkout -->
    <section v-if="currentStep === 4" class="section">
      <CheckoutView
        :order="orderSummary"
        :pizza-price="pizzaPrice"
        :delivery-fee="deliveryFee"
        :total-price="totalPrice"
        @back="prevStep"
        @confirm="handleConfirmOrder"
      />
    </section>

    <!-- Step 5: Confirmation -->
    <section v-if="currentStep === 5" class="section">
      <ConfirmationView
        :order="confirmedOrder"
        @new-order="handleNewOrder"
      />
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { usePizzaOrder } from '@/composables/usePizzaOrder';
import PizzaSelection from '@/components/PizzaSelection.vue';
import ToppingSelection from '@/components/ToppingSelection.vue';
import AddressForm from '@/components/AddressForm.vue';
import CheckoutView from '@/components/CheckoutView.vue';
import ConfirmationView from '@/components/ConfirmationView.vue';

const {
  pizzas,
  toppings,
  selectedPizzaId,
  selectedToppingIds,
  address,
  pizzaPrice,
  deliveryFee,
  currentStep,
  selectedPizza,
  baseToppingIds,
  totalPrice,
  loadPizzas,
  loadToppings,
  selectPizza,
  toggleTopping,
  updatePizzaPrice,
  createOrder,
  confirmOrder,
  resetOrder,
  nextStep,
  prevStep
} = usePizzaOrder();

const confirmedOrder = computed(() => ({
  id: null,
  pizza: selectedPizza.value,
  toppingIds: selectedToppingIds.value,
  address: address.value,
  totalPrice: totalPrice.value
}));

const orderSummary = computed(() => ({
  pizza: selectedPizza.value,
  baseToppingIds: baseToppingIds.value,
  selectedToppingIds: selectedToppingIds.value,
  toppings: toppings.value,
  address: address.value
}));

onMounted(async () => {
  await loadToppings();
  await loadPizzas();
});

const goToToppings = async () => {
  if (!selectedPizzaId.value) {
    alert('Please select a pizza first');
    return;
  }
  await updatePizzaPrice();
  nextStep();
};

const goToCheckout = async () => {
  if (!address.value.trim()) {
    return;
  }
  await createOrder();
  nextStep();
};

const handleConfirmOrder = async () => {
  try {
    const order = await confirmOrder();
    confirmedOrder.value.id = order.id;
    confirmedOrder.value.totalPrice = order.totalPrice;
    nextStep();
  } catch (error) {
    alert('Failed to confirm order. Please try again.');
  }
};

const handleNewOrder = () => {
  resetOrder();
};
</script>
