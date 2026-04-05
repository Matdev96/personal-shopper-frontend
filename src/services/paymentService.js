import api from './api';

const paymentService = {
  register: (data) => api.post('/payments', data).then((r) => r.data),
  listMine: () => api.get('/payments/my').then((r) => r.data),
};

export default paymentService;
