import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('snip_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('snip_token');
      localStorage.removeItem('snip_user');
    }
    return Promise.reject(error);
  }
);

export const urlApi = {
  createUrl: (data) => api.post('/urls', data),
  getAllUrls: () => api.get('/urls'),
  getUrlById: (id) => api.get(`/urls/${id}`),
  getAnalytics: (id) => api.get(`/urls/${id}/analytics`),
  deleteUrl: (id) => api.delete(`/urls/${id}`),
  getTopUrls: () => api.get('/urls/top'),
  getQrCodeUrl: (id) => `${API_BASE}/urls/${id}/qr`,
};

export default api;
