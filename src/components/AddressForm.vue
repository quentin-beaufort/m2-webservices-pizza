<template>
  <div>
    <h2>Step 3: Delivery Address</h2>
    
    <div class="form-group">
      <label for="address">Enter your delivery address:</label>
      <textarea
        id="address"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        rows="4"
        placeholder="123 Main Street&#10;Apt 4B&#10;New York, NY 10001"
      />
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
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
      <button class="btn btn-primary" @click="handleNext">Next: Checkout</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
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

const emit = defineEmits(['update:modelValue', 'back', 'next']);

const errorMessage = ref('');

const handleNext = () => {
  if (!props.modelValue.trim()) {
    errorMessage.value = 'Please enter a delivery address';
    return;
  }
  errorMessage.value = '';
  emit('next');
};
</script>
