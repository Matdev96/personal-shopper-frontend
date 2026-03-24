import api from './api';

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

const categoryService = {
  listCategories: async (skip = 0, limit = 100): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>('/categories', { params: { skip, limit } });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getCategoryById: async (categoryId: number): Promise<Category> => {
    try {
      const response = await api.get<Category>(`/categories/${categoryId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  createCategory: async (name: string, description: string): Promise<Category> => {
    try {
      const response = await api.post<Category>('/categories', { name, description });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  updateCategory: async (categoryId: number, categoryData: Partial<Category>): Promise<Category> => {
    try {
      const response = await api.put<Category>(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  deleteCategory: async (categoryId: number): Promise<void> => {
    try {
      await api.delete(`/categories/${categoryId}`);
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default categoryService;
