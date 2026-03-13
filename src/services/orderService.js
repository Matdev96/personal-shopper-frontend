import api from './api';

const orderService = {
  /**
   * Listar todos os pedidos do usuário com filtros e paginação
   * @param {object} filters - Filtros opcionais
   * @param {number} filters.skip - Número de registros a pular (padrão: 0)
   * @param {number} filters.limit - Número máximo de registros a retornar (padrão: 10)
   * @param {string} filters.status_filter - Filtrar por status (pending, processing, shipped, delivered, cancelled)
   * @param {string} filters.min_date - Data mínima (formato: YYYY-MM-DD)
   * @param {string} filters.max_date - Data máxima (formato: YYYY-MM-DD)
   * @param {number} filters.min_price - Preço mínimo
   * @param {number} filters.max_price - Preço máximo
   * @param {string} filters.sort_by - Campo para ordenação (created_at, total_price)
   * @param {string} filters.sort_order - Ordem de classificação (asc, desc)
   * @returns {Promise} Lista de pedidos filtrados e paginados
   */
  listOrders: async (filters = {}) => {
    try {
      const params = {
        skip: filters.skip || 0,
        limit: filters.limit || 10,
        ...(filters.status_filter && { status_filter: filters.status_filter }),
        ...(filters.min_date && { min_date: filters.min_date }),
        ...(filters.max_date && { max_date: filters.max_date }),
        ...(filters.min_price !== undefined && { min_price: filters.min_price }),
        ...(filters.max_price !== undefined && { max_price: filters.max_price }),
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      };

      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obter detalhes de um pedido específico
   * @param {number} order_id - ID do pedido
   * @returns {Promise} Dados do pedido
   */
  getOrderById: async (order_id) => {
    try {
      const response = await api.get(`/orders/${order_id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Criar um novo pedido a partir do carrinho
   * @param {object} orderData - Dados do pedido
   * @param {array} orderData.items - Array de itens do pedido
   * @param {number} orderData.items[].product_id - ID do produto
   * @param {number} orderData.items[].quantity - Quantidade do produto
   * @param {string} orderData.shipping_address - Endereço de entrega
   * @param {string} orderData.payment_method - Método de pagamento
   * @returns {Promise} Dados do pedido criado
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cancelar um pedido
   * Apenas pedidos com status PENDING podem ser cancelados
   * @param {number} order_id - ID do pedido
   * @returns {Promise} Dados do pedido cancelado
   */
  cancelOrder: async (order_id) => {
    try {
      const response = await api.put(`/orders/${order_id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Verificar o status de um pedido
   * @param {number} order_id - ID do pedido
   * @returns {Promise} Status do pedido
   */
  getOrderStatus: async (order_id) => {
    try {
      const response = await api.get(`/orders/${order_id}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Atualizar o status de um pedido
   * Apenas o proprietário do pedido pode atualizar o status
   * @param {number} order_id - ID do pedido
   * @param {string} new_status - Novo status (pending, processing, shipped, delivered, cancelled)
   * @returns {Promise} Dados do pedido atualizado
   */
  updateOrderStatus: async (order_id, new_status) => {
    try {
      const response = await api.put(`/orders/${order_id}/status`, null, {
        params: { new_status },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default orderService;