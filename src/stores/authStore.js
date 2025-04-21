// src/store/authStore.js
import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  role: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,

  login: async (email, password, deviceId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password,
        device_id: deviceId,
      });
      set({
        user: res.data.user,
        token: res.data.token,
        isLoading: false,
        isLoggedIn: true,
      });
      const { access_token, refresh_token } = res.data.data.tokens;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      set({
        token: access_token,
        refreshToken: refresh_token,
        role: res.data.data.role,
        trackingCode: res.data.data.tracking_code,
        isLoading: false,
        isLoggedIn: true,
      });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    set({
      user: null,
      token: null,
      refreshToken: null,
      role: null,
      trackingCode: null,
      isLoggedIn: false,
    });
  },
}));
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default useAuthStore;
