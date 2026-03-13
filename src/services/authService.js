import api from './api';
import Cookies from 'js-cookie';

const authService = {
  /**
   * Registrar um novo usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @param {string} full_name - Nome completo do usuário
   * @returns {Promise} Resposta do servidor
   */
  register: async (email, password, full_name) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        full_name,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fazer login
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Resposta com token e dados do usuário
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Salvar token no localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        Cookies.set('token', response.data.access_token, { expires: 7 });
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obter dados do usuário autenticado
   * @returns {Promise} Dados do usuário
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Atualizar dados do usuário
   * @param {object} userData - Dados a serem atualizados
   * @returns {Promise} Dados atualizados do usuário
   */
  updateUser: async (userData) => {
    try {
      const response = await api.put('/auth/me', userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fazer logout
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
  },

  /**
   * Obter token armazenado
   * @returns {string} Token JWT
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Obter usuário armazenado
   * @returns {object} Dados do usuário
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Verificar se o usuário está autenticado
   * @returns {boolean} True se autenticado, false caso contrário
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;