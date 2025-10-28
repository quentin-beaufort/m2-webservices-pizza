<template>
  <div>
    <h2>Step 1: Choose Your Pizza</h2>
    <div class="pizzas-grid">
      <div
        v-for="pizza in pizzas"
        :key="pizza.id"
        class="pizza-item"
        :class="{ selected: selectedPizzaId === pizza.id }"
        @click="$emit('select-pizza', pizza.id)"
      >
        <div class="pizza-name">{{ pizza.name }}</div>
        <div class="pizza-description">{{ pizza.description || '' }}</div>
        <div class="pizza-toppings">
          Includes: {{ getBaseToppingNames(pizza.baseToppings) }}
        </div>
        <div class="pizza-price">${{ parseFloat(pizza.basePrice).toFixed(2) }}</div>
      </div>
    </div>
    <button class="btn btn-primary" @click="$emit('next')">
      Next: Add Extra Toppings
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  pizzas: {
    type: Array,
    required: true
  },
  toppings: {
    type: Array,
    required: true
  },
  selectedPizzaId: {
    type: Number,
    default: null
  }
});

defineEmits(['select-pizza', 'next']);

const getBaseToppingNames = (baseToppingIds) => {
  return baseToppingIds
    .map(id => {
      const topping = props.toppings.find(t => t.id === id);
      return topping ? topping.name : '';
    })
    .filter(name => name)
    .join(', ');
};
</script>
