import api from './api';

const cartService = {
  /**
   * Obter o carrinho do usuário com todos os itens
   * @returns {Promise} Dados do carrinho com itens
   */
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Listar itens do carrinho com paginação e ordenação
   * @param {object} filters - Filtros opcionais
   * @param {number} filters.skip - Número de registros a pular (padrão: 0)
   * @param {number} filters.limit - Número máximo de registros a retornar (padrão: 10)
   * @param {string} filters.sort_by - Campo para ordenação (created_at, price_at_time)
   * @param {string} filters.sort_order - Ordem de classificação (asc, desc)
   * @returns {Promise} Lista de itens do carrinho
   */
  listCartItems: async (filters = {}) => {
    try {
      const params = {
        skip: filters.skip || 0,
        limit: filters.limit || 10,
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      };

      const response = await api.get('/cart/items', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Adicionar um item ao carrinho
   * Se o carrinho não existe, cria um novo
   * Se o item já existe no carrinho, atualiza a quantidade
   * @param {number} product_id - ID do produto
   * @param {number} quantity - Quantidade do produto
   * @returns {Promise} Dados do item adicionado
   */
  addItemToCart: async (product_id, quantity) => {
    try {
      const response = await api.post('/cart/items', {
        product_id,
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Atualizar a quantidade de um item no carrinho
   * @param {number} item_id - ID do item do carrinho
   * @param {number} quantity - Nova quantidade (deve ser > 0)
   * @returns {Promise} Dados do item atualizado
   */
  updateCartItem: async (item_id, quantity) => {
    try {
      const response = await api.put(`/cart/items/${item_id}`, null, {
        params: { quantity },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Remover um item do carrinho
   * @param {number} item_id - ID do item do carrinho
   * @returns {Promise} Resposta do servidor
   */
  removeItemFromCart: async (item_id) => {
    try {
      const response = await api.delete(`/cart/items/${item_id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Limpar todos os itens do carrinho
   * @returns {Promise} Resposta do servidor
   */
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default cartService;