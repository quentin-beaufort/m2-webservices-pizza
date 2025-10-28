import { ref } from 'vue';

const API_BASE = '/api';

export function useApi() {
  const loading = ref(false);
  const error = ref(null);

  const request = async (url, options = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('API Error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const get = (url) => request(url);
  const post = (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) });
  const put = (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) });
  const del = (url) => request(url, { method: 'DELETE' });

  return {
    loading,
    error,
    get,
    post,
    put,
    del
  };
}
