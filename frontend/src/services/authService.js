import api from './api';

export const authService = {
  // Register with email/password
  async register(email, password, name) {
    const response = await api.post('/auth/register', {
      email,
      password,
      name,
    });
    
    // Store token and user (response is already .data from interceptor)
    if (response.data.token) {
      this.storeToken(response.data.token);
      this.storeUser(response.data.user);
    }
    
    return response;
  },

  // Login with email/password
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    // Store token and user (response is already .data from interceptor)
    if (response.data.token) {
      this.storeToken(response.data.token);
      this.storeUser(response.data.user);
    }
    
    return response;
  },

  // Get current user
  async getMe() {
    return api.get('/auth/me');
  },

  // Logout
  async logout() {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return response;
  },

  // Refresh token
  async refreshToken() {
    return api.post('/auth/refresh');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // Get stored user
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Store user
  storeUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Store token
  storeToken(token) {
    localStorage.setItem('auth_token', token);
  },
};
