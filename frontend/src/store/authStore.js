import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    const token = localStorage.getItem('cv_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const res = await api.get('/auth/me');
        set({ user: res.data.user, loading: false });
      } catch (error) {
        localStorage.removeItem('cv_token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('cv_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ user });
    return user;
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, user } = res.data;
    localStorage.setItem('cv_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ user });
    return user;
  },

  logout: () => {
    localStorage.removeItem('cv_token');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null });
  },

  updateProfile: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    }));
  }
}));

export default useAuthStore;
