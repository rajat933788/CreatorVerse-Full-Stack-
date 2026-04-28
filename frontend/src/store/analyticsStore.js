import { create } from 'zustand';
import { analyticsApi } from '../services/api';

const useAnalyticsStore = create((set) => ({
  overview: null,
  loading: false,
  error: null,

  fetchOverview: async () => {
    set({ loading: true, error: null });
    try {
      const res = await analyticsApi.getOverview();
      set({ overview: res.data.data || res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch analytics overview', loading: false });
    }
  }
}));

export default useAnalyticsStore;
