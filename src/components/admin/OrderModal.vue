<template>
  <div class="modal active" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Order Details</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="order-details">
          <div class="order-detail-item">
            <span class="order-detail-label">Order ID:</span> {{ order.id }}
          </div>
          <div class="order-detail-item">
            <span class="order-detail-label">Status:</span>
            <span class="status-badge" :class="`status-${order.status}`">
              {{ order.status }}
            </span>
          </div>
          <div class="order-detail-item">
            <span class="order-detail-label">Date & Time:</span> {{ formatDate(order.createdAt) }}
          </div>
          <div class="order-detail-item">
            <span class="order-detail-label">Pizza:</span> {{ pizzaName }}
          </div>
          <div class="order-detail-item">
            <span class="order-detail-label">Base Toppings:</span> {{ baseToppingNames || 'None' }}
          </div>
          <div class="order-detail-item">
            <span class="order-detail-label">Extra Toppings:</span> {{ extraToppingNames }}
          </div>
          <div class="order-detail-item">
            <span class="order-detail-label">Delivery Address:</span><br>
            <div v-html="formatAddress(order.address)"></div>
          </div>
          <div class="order-detail-item">
            <span class="order-detail-label">Total Price:</span> ${{ parseFloat(order.totalPrice).toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  pizzaName: {
    type: String,
    required: true
  },
  toppingNames: {
    type: String,
    required: true
  },
  baseToppingNames: {
    type: String,
    default: ''
  }
});

defineEmits(['close']);

const extraToppingNames = computed(() => {
  // Parse topping names and base topping names to find extras
  if (!props.toppingNames) return 'None';
  if (!props.baseToppingNames) return props.toppingNames;
  
  const allToppings = props.toppingNames.split(', ').filter(t => t);
  const baseToppings = props.baseToppingNames.split(', ').filter(t => t);
  
  const extras = allToppings.filter(t => !baseToppings.includes(t));
  
  return extras.length > 0 ? extras.join(', ') : 'None';
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const formatAddress = (address) => {
  return escapeHtml(address || '').replace(/\n/g, '<br>');
};
</script>
