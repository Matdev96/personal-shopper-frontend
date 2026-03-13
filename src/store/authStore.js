import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Inicializar estado a partir do localStorage
  initializeAuth: () => {
    const token = authService.getToken();
    const user = authService.getUser();
    set({ token, user });
  },

  // Registrar novo usuário
  register: async (email, password, full_name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(email, password, full_name);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Fazer login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({
        user: response.user,
        token: response.access_token,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Obter dados do usuário autenticado
  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.getCurrentUser();
      set({ user: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Atualizar dados do usuário
  updateUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateUser(userData);
      set({ user: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Fazer logout
  logout: () => {
    authService.logout();
    set({ user: null, token: null, error: null });
  },

  // Verificar se está autenticado
  isAuthenticated: () => {
    return authService.isAuthenticated();
  },

  // Limpar erro
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;