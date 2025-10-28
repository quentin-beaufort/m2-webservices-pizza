<template>
  <div>
    <h2>Step 2: Add Extra Toppings (Optional)</h2>
    
    <div v-if="pizza" class="pizza-info">
      <div class="selected-pizza-header">
        <strong>{{ pizza.name }}</strong> - ${{ parseFloat(pizza.basePrice).toFixed(2) }}
      </div>
      <div class="selected-pizza-base">
        Base toppings: {{ getBaseToppingNames() }}
      </div>
    </div>

    <div class="toppings-grid">
      <div
        v-for="topping in toppings"
        :key="topping.id"
        class="topping-item"
        :class="{
          'base-topping': baseToppingIds.includes(topping.id),
          selected: selectedToppingIds.includes(topping.id)
        }"
        @click="handleToppingClick(topping.id)"
      >
        <div class="topping-name">
          {{ getToppingLabel(topping) }}
        </div>
        <div class="topping-price">
          {{ getToppingPrice(topping) }}
        </div>
      </div>
    </div>

    <div class="price-display">
      <div class="price-breakdown">
        <div class="price-item">
          <span>Base Pizza:</span>
          <span>${{ parseFloat(pizza?.basePrice || 0).toFixed(2) }}</span>
        </div>
        <div class="price-item">
          <span>Extra Toppings:</span>
          <span>${{ toppingsPrice.toFixed(2) }}</span>
        </div>
        <div class="price-item total">
          <span>Pizza Total:</span>
          <span>${{ pizzaPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-secondary" @click="$emit('back')">Back</button>
      <button class="btn btn-primary" @click="$emit('next')">Next: Enter Address</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  pizza: {
    type: Object,
    default: null
  },
  toppings: {
    type: Array,
    required: true
  },
  selectedToppingIds: {
    type: Array,
    required: true
  },
  baseToppingIds: {
    type: Array,
    required: true
  },
  pizzaPrice: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['toggle-topping', 'back', 'next']);

const toppingsPrice = computed(() => {
  const basePrice = props.pizza?.basePrice || 0;
  return props.pizzaPrice - basePrice;
});

const getBaseToppingNames = () => {
  return props.baseToppingIds
    .map(id => {
      const topping = props.toppings.find(t => t.id === id);
      return topping ? topping.name : '';
    })
    .filter(name => name)
    .join(', ');
};

const getToppingLabel = (topping) => {
  const isBase = props.baseToppingIds.includes(topping.id);
  return isBase ? `${topping.name} (Included)` : topping.name;
};

const getToppingPrice = (topping) => {
  const isBase = props.baseToppingIds.includes(topping.id);
  return isBase ? 'Included' : `+$${parseFloat(topping.price).toFixed(2)}`;
};

const handleToppingClick = (toppingId) => {
  if (!props.baseToppingIds.includes(toppingId)) {
    emit('toggle-topping', toppingId);
  }
};
</script>
