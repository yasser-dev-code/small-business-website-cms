import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mg_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

export const resolveImage = (src) => {
  if (!src) return '';
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith('/uploads')) return (import.meta.env.VITE_BACKEND_URL || '') + src;
  return src;
};

export default api;
