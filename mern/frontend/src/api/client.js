import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Normalize errors so components can just read `err.message`
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Something went wrong talking to the server.';
    return Promise.reject(new Error(message));
  }
);

/* ── Contacts ─────────────────────────────────────────────── */
export const contactsApi = {
  // Returns the full envelope ({ data, pagination, ... }) so callers can
  // page through results; pass { page, limit } to control the page.
  list: (params) => api.get('/contacts', { params }).then((r) => r.data),
  create: (payload) => api.post('/contacts', payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/contacts/${id}`).then((r) => r.data),
  clearAll: () => api.delete('/contacts').then((r) => r.data),
};

/* ── Tasks ────────────────────────────────────────────────── */
export const tasksApi = {
  list: (params) => api.get('/tasks', { params }).then((r) => r.data),
  create: (payload) => api.post('/tasks', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data.data),
  toggle: (id) => api.patch(`/tasks/${id}/toggle`).then((r) => r.data.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((r) => r.data),
  clearCompleted: () => api.delete('/tasks/completed/all').then((r) => r.data),
};

export default api;
