<template>
  <div>
    <h2>Step 4: Review & Pay</h2>
    
    <div class="order-summary">
      <h3>Order Summary</h3>
      <div class="order-details">
        <div class="order-detail-item">
          <span class="order-detail-label">Pizza:</span> {{ order.pizza?.name || 'Unknown Pizza' }}
        </div>
        <div class="order-detail-item">
          <span class="order-detail-label">Base Toppings:</span> {{ getBaseToppingNames() }}
        </div>
        <div class="order-detail-item">
          <span class="order-detail-label">Extra Toppings:</span> {{ getExtraToppingNames() }}
        </div>
        <div class="order-detail-item">
          <span class="order-detail-label">Delivery Address:</span><br>
          <div v-html="formatAddress(order.address)"></div>
        </div>
      </div>
    </div>

    <div class="price-display">
      <div class="price-breakdown">
        <div class="price-item">
          <span>Pizza Total:</span>
          <span>${{ pizzaPrice.toFixed(2) }}</span>
        </div>
        <div class="price-item">
          <span>Delivery Fee:</span>
          <span>${{ deliveryFee.toFixed(2) }}</span>
        </div>
        <div class="price-item total">
          <span>Total:</span>
          <span>${{ totalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-secondary" @click="$emit('back')">Back</button>
      <button class="btn btn-success" @click="$emit('confirm')">Pay Now</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  pizzaPrice: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

defineEmits(['back', 'confirm']);

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const getBaseToppingNames = () => {
  if (!props.order.baseToppingIds || !props.order.toppings) return 'None';
  
  const names = props.order.baseToppingIds
    .map(id => {
      const topping = props.order.toppings.find(t => t.id === id);
      return topping ? topping.name : '';
    })
    .filter(name => name)
    .join(', ');
  
  return names || 'None';
};

const getExtraToppingNames = () => {
  if (!props.order.selectedToppingIds || !props.order.baseToppingIds || !props.order.toppings) {
    return 'None';
  }
  
  const extraIds = props.order.selectedToppingIds.filter(
    id => !props.order.baseToppingIds.includes(id)
  );
  
  if (extraIds.length === 0) return 'None';
  
  return extraIds
    .map(id => {
      const topping = props.order.toppings.find(t => t.id === id);
      return topping ? topping.name : '';
    })
    .filter(name => name)
    .join(', ');
};

const formatAddress = (address) => {
  return escapeHtml(address).replace(/\n/g, '<br>');
};
</script>
