<template>
  <div class="auth-card">
    <h2>Admin Login</h2>
    <p>Please enter the admin password to access the dashboard</p>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="admin-password">Password:</label>
        <input
          id="admin-password"
          v-model="password"
          type="password"
          placeholder="Enter admin password"
          required
        />
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login']);

const password = ref('');
const errorMessage = ref('');

const handleSubmit = () => {
  if (!password.value) {
    errorMessage.value = 'Please enter a password';
    return;
  }
  emit('login', password.value);
  password.value = '';
};
</script>
