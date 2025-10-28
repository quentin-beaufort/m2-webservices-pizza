<template>
  <div class="confirmation-message">
    <div class="success-icon">
      <img src="/icons/check-circle.svg" alt="Success" class="icon-success" />
    </div>
    <h2>Order Confirmed!</h2>
    <p>Thank you for your order. Your pizza is being prepared and will be delivered soon!</p>
    
    <div class="order-summary">
      <div class="order-details">
        <div v-if="order.id" class="order-detail-item">
          <span class="order-detail-label">Order #:</span> {{ order.id }}
        </div>
        <div class="order-detail-item">
          <span class="order-detail-label">Pizza:</span> {{ order.pizza?.name || 'Unknown Pizza' }}
        </div>
        <div class="order-detail-item">
          <span class="order-detail-label">Delivery Address:</span><br>
          <div v-html="formatAddress(order.address)"></div>
        </div>
        <div class="order-detail-item">
          <span class="order-detail-label">Total Paid:</span> ${{ order.totalPrice?.toFixed(2) || '0.00' }}
        </div>
      </div>
    </div>
    
    <button class="btn btn-primary" @click="$emit('new-order')">
      Place Another Order
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

defineEmits(['new-order']);

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const formatAddress = (address) => {
  return escapeHtml(address || '').replace(/\n/g, '<br>');
};
</script>
