import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cv_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isAuthEndpoint) {
      // Token expired or invalid on a protected route — clear and redirect
      localStorage.removeItem('cv_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    } else if (status >= 500) {
      toast.error('Server error. Please try again.');
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Analytics ──────────────────────────────────────────────────────────────
export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getPlatformStats: (platform) => api.get(`/analytics/platform/${platform}`),
  getEngagementTrend: (days = 30) => api.get(`/analytics/engagement-trend?days=${days}`),
  getTopContent: () => api.get('/analytics/top-content'),
  connectPlatform: (platform, code) => api.post('/analytics/connect', { platform, code }),
};

// ── CRM / Brand Deals ───────────────────────────────────────────────────────
export const crmApi = {
  getDeals: (params) => api.get('/crm/deals', { params }),
  getDeal: (id) => api.get(`/crm/deals/${id}`),
  createDeal: (data) => api.post('/crm/deals', data),
  updateDeal: (id, data) => api.put(`/crm/deals/${id}`, data),
  deleteDeal: (id) => api.delete(`/crm/deals/${id}`),
  getBrands: () => api.get('/crm/brands'),
  getInvoices: () => api.get('/crm/invoices'),
  generateInvoice: (dealId) => api.post(`/crm/invoices/${dealId}`),
};

// ── Team ────────────────────────────────────────────────────────────────────
export const teamApi = {
  getMembers: () => api.get('/team/members'),
  inviteMember: (data) => api.post('/team/invite', data),
  updateMemberRole: (id, role) => api.put(`/team/members/${id}/role`, { role }),
  removeMember: (id) => api.delete(`/team/members/${id}`),
  getTasks: () => api.get('/team/tasks'),
  createTask: (data) => api.post('/team/tasks', data),
  updateTask: (id, data) => api.put(`/team/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/team/tasks/${id}`),
  moveTask: (id, status) => api.patch(`/team/tasks/${id}/status`, { status }),
};

// ── Marketplace ─────────────────────────────────────────────────────────────
export const marketplaceApi = {
  getFreelancers: (params) => api.get('/marketplace/freelancers', { params }),
  getFreelancer: (id) => api.get(`/marketplace/freelancers/${id}`),
  getListings: () => api.get('/marketplace/listings'),
  createListing: (data) => api.post('/marketplace/listings', data),
  applyToListing: (id) => api.post(`/marketplace/listings/${id}/apply`),
  hireFreelancer: (freelancerId, data) => api.post(`/marketplace/hire/${freelancerId}`, data),
};

// ── AI / Recommendations ────────────────────────────────────────────────────
export const aiApi = {
  getRecommendations: () => api.get('/ai/recommendations'),
  forecastEngagement: (data) => api.post('/ai/forecast', data),
  getBrandMatches: () => api.get('/ai/brand-matches'),
  getContentSuggestions: () => api.get('/ai/content-suggestions'),
  getPostingTimeSuggestion: () => api.get('/ai/posting-time'),
  chatWithAI: (messages) => api.post('/ai/chat', { messages }),
};
