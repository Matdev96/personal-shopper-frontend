import api from './api';
import Cookies from 'js-cookie';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UpdateUserData {
  email?: string;
  full_name?: string;
  password?: string;
}

const authService = {
  register: async (email: string, password: string, full_name: string): Promise<User> => {
    try {
      const response = await api.post<User>('/auth/register', { email, password, full_name });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        Cookies.set('token', response.data.access_token, { expires: 7 });
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (userData: UpdateUserData): Promise<User> => {
    try {
      const response = await api.put<User>('/auth/me', userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
