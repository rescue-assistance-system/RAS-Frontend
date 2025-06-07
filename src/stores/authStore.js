// src/store/authStore.js
import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      user_id: decoded.user_id || decoded.id || decoded.sub,
      device_id: decoded.device_id,
      role: decoded.role,
      // Thêm các trường khác nếu cần
    };
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getUserFromToken(localStorage.getItem('accessToken')),
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  role: null,
  isLoading: false,
  error: null,
  isLoggedIn: !!localStorage.getItem('accessToken'),

  login: async (email, password, deviceId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password,
        device_id: deviceId,
      });
      const { access_token, refresh_token } = res.data.data.tokens;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      set({
        user: getUserFromToken(access_token),
        token: access_token,
        refreshToken: refresh_token,
        role: res.data.data.role,
        trackingCode: res.data.data.tracking_code,
        isLoading: false,
        isLoggedIn: true,
        error: null,
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
