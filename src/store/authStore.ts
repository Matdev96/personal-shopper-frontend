import { create } from 'zustand';
import authService, { User, UpdateUserData, LoginResponse } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  initializeAuth: () => void;
  register: (email: string, password: string, full_name: string) => Promise<User>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  getCurrentUser: () => Promise<User>;
  updateUser: (userData: UpdateUserData) => Promise<User>;
  logout: () => void;
  clearError: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  initializeAuth: () => {
    const token = authService.getToken();
    const user = authService.getUser();
    set({ token, user, isAuthenticated: !!token });
  },

  register: async (email, password, full_name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(email, password, full_name);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({ user: response.user, token: response.access_token, isLoading: false, isAuthenticated: true });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.getCurrentUser();
      set({ user: response, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  updateUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateUser(userData);
      set({ user: response, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, error: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
