import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle authentication errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear on 401 Unauthorized (invalid/expired token)
      if (typeof window !== 'undefined') {
        console.error('Authentication failed - token invalid or expired');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

// Restaurant API
export const restaurantAPI = {
  getAll: () => api.get('/restaurants'),
  getOne: (id: string) => api.get(`/restaurants/${id}`),
};

// Menu API
export const menuAPI = {
  getByRestaurant: (restaurantId: string) =>
    api.get(`/menu/restaurant/${restaurantId}`),
  getOne: (id: string) => api.get(`/menu/${id}`),
};

// Order API
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getOne: (id: string) => api.get(`/orders/${id}`),
  placeOrder: (id: string, paymentMethodId?: string) =>
    api.patch(`/orders/${id}/place`, { paymentMethodId }),
  cancelOrder: (id: string) => api.delete(`/orders/${id}`),
};

// Payment API
export const paymentAPI = {
  getAll: () => api.get('/payment-methods'),
  getOne: (id: string) => api.get(`/payment-methods/${id}`),
  create: (data: any) => api.post('/payment-methods', data),
  update: (id: string, data: any) => api.patch(`/payment-methods/${id}`, data),
  delete: (id: string) => api.delete(`/payment-methods/${id}`),
};

export default api;
