import api from './api';

const categoryService = {
  /**
   * Listar todas as categorias
   * @param {number} skip - Número de registros a pular (padrão: 0)
   * @param {number} limit - Número máximo de registros a retornar (padrão: 10)
   * @returns {Promise} Lista de categorias
   */
  listCategories: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get('/categories', {
        params: {
          skip,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obter uma categoria por ID
   * @param {number} categoryId - ID da categoria
   * @returns {Promise} Dados da categoria
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Criar uma nova categoria (requer autenticação de admin)
   * @param {string} name - Nome da categoria
   * @param {string} description - Descrição da categoria
   * @returns {Promise} Dados da categoria criada
   */
  createCategory: async (name, description) => {
    try {
      const response = await api.post('/categories', {
        name,
        description,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Atualizar uma categoria (requer autenticação de admin)
   * @param {number} categoryId - ID da categoria
   * @param {object} categoryData - Dados a serem atualizados
   * @returns {Promise} Dados atualizados da categoria
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Deletar uma categoria (requer autenticação de admin)
   * @param {number} categoryId - ID da categoria
   * @returns {Promise} Resposta do servidor
   */
  deleteCategory: async (categoryId) => {
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default categoryService;