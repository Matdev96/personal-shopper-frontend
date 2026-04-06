import api from './api';

const requestService = {
  create: (data) => api.post('/requests', data).then((r) => r.data),
  listMine: (params = {}) => api.get('/requests', { params }).then((r) => r.data),
  getById: (id) => api.get(`/requests/${id}`).then((r) => r.data),
  confirm: (id) => api.put(`/requests/${id}/confirm`).then((r) => r.data),
  acceptAlternative: (id) => api.put(`/requests/${id}/accept-alternative`).then((r) => r.data),
  cancel: (id) => api.put(`/requests/${id}/cancel`).then((r) => r.data),

  // Admin
  listAll: (params = {}) => api.get('/admin/requests', { params }).then((r) => r.data),
  adminGetById: (id) => api.get(`/admin/requests/${id}`).then((r) => r.data),
  adminUpdateStatus: (id, data) => api.put(`/admin/requests/${id}/status`, data).then((r) => r.data),
  adminQuote: (id, data) => api.put(`/admin/requests/${id}/quote`, data).then((r) => r.data),
  adminSuggestAlternative: (id, data) => api.put(`/admin/requests/${id}/suggest-alternative`, data).then((r) => r.data),
  adminCancel: (id, data) => api.put(`/admin/requests/${id}/cancel`, data).then((r) => r.data),
  adminListPayments: (id) => api.get(`/admin/requests/${id}/payments`).then((r) => r.data),
  adminReviewPayment: (requestId, paymentId, data) =>
    api.put(`/admin/requests/${requestId}/payments/${paymentId}/review`, data).then((r) => r.data),
};

export default requestService;
