import { create } from 'zustand';
import categoryService from '../services/categoryService';

const useCategoryStore = create((set, get) => ({
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,

  // Listar todas as categorias
  fetchCategories: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.listCategories(
        filters.skip || 0,
        filters.limit || 10
      );
      set({ categories: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Obter categoria por ID
  fetchCategoryById: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.getCategoryById(categoryId);
      set({ currentCategory: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Criar nova categoria (admin)
  createCategory: async (name, description) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.createCategory(name, description);
      
      // Adicionar nova categoria à lista
      const categories = get().categories;
      categories.unshift(response);
      
      set({ categories, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Atualizar categoria (admin)
  updateCategory: async (categoryId, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.updateCategory(categoryId, categoryData);
      
      // Atualizar categoria na lista
      const categories = get().categories;
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      
      if (categoryIndex !== -1) {
        categories[categoryIndex] = response;
      }
      
      // Atualizar categoria atual se for a mesma
      if (get().currentCategory?.id === categoryId) {
        set({ currentCategory: response });
      }
      
      set({ categories, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Deletar categoria (admin)
  deleteCategory: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.deleteCategory(categoryId);
      
      // Remover categoria da lista
      const categories = get().categories.filter(c => c.id !== categoryId);
      
      // Limpar categoria atual se for a mesma
      if (get().currentCategory?.id === categoryId) {
        set({ currentCategory: null });
      }
      
      set({ categories, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Limpar erro
  clearError: () => {
    set({ error: null });
  },

  // Limpar categoria atual
  clearCurrentCategory: () => {
    set({ currentCategory: null });
  },
}));

export default useCategoryStore;