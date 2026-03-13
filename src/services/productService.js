import api from './api';

const productService = {
  /**
   * Listar todos os produtos com filtros e paginação
   * @param {object} filters - Filtros opcionais
   * @param {number} filters.skip - Número de registros a pular (padrão: 0)
   * @param {number} filters.limit - Número máximo de registros a retornar (padrão: 10)
   * @param {number} filters.category_id - Filtrar por ID da categoria
   * @param {number} filters.min_price - Preço mínimo
   * @param {number} filters.max_price - Preço máximo
   * @param {boolean} filters.in_stock - Filtrar por disponibilidade
   * @param {string} filters.search - Buscar por nome do produto
   * @param {string} filters.sort_by - Campo para ordenação (created_at, price, name)
   * @param {string} filters.sort_order - Ordem de classificação (asc, desc)
   * @returns {Promise} Lista de produtos filtrados
   */
  listProducts: async (filters = {}) => {
    try {
      const params = {
        skip: filters.skip || 0,
        limit: filters.limit || 10,
        ...(filters.category_id && { category_id: filters.category_id }),
        ...(filters.min_price !== undefined && { min_price: filters.min_price }),
        ...(filters.max_price !== undefined && { max_price: filters.max_price }),
        ...(filters.in_stock !== undefined && { in_stock: filters.in_stock }),
        ...(filters.search && { search: filters.search }),
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      };

      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obter um produto por ID
   * @param {number} productId - ID do produto
   * @returns {Promise} Dados do produto
   */
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Criar um novo produto (requer autenticação de admin)
   * @param {object} productData - Dados do produto
   * @param {string} productData.name - Nome do produto
   * @param {string} productData.description - Descrição do produto
   * @param {number} productData.price - Preço do produto
   * @param {string} productData.size - Tamanho do produto
   * @param {string} productData.color - Cor do produto
   * @param {number} productData.category_id - ID da categoria
   * @param {string} productData.image_url - URL da imagem
   * @param {number} productData.stock - Quantidade em estoque
   * @returns {Promise} Dados do produto criado
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Atualizar um produto (requer autenticação de admin)
   * @param {number} productId - ID do produto
   * @param {object} productData - Dados a serem atualizados
   * @returns {Promise} Dados atualizados do produto
   */
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fazer upload de imagem para um produto (requer autenticação de admin)
   * @param {number} productId - ID do produto
   * @param {File} file - Arquivo de imagem
   * @returns {Promise} Resposta do servidor com dados do produto atualizado
   */
  uploadProductImage: async (productId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/products/upload', formData, {
        params: { product_id: productId },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Deletar um produto (requer autenticação de admin)
   * @param {number} productId - ID do produto
   * @returns {Promise} Resposta do servidor
   */
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default productService;