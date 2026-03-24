import { create } from 'zustand';
import categoryService, { Category } from '../services/categoryService';

interface CategoryFilters {
  skip?: number;
  limit?: number;
}

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;

  fetchCategories: (filters?: CategoryFilters) => Promise<Category[]>;
  fetchCategoryById: (categoryId: number) => Promise<Category>;
  createCategory: (name: string, description: string) => Promise<Category>;
  updateCategory: (categoryId: number, categoryData: Partial<Category>) => Promise<Category>;
  deleteCategory: (categoryId: number) => Promise<void>;
  clearError: () => void;
  clearCurrentCategory: () => void;
}

const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.listCategories(filters.skip || 0, filters.limit || 100);
      set({ categories: response, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  fetchCategoryById: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.getCategoryById(categoryId);
      set({ currentCategory: response, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  createCategory: async (name, description) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.createCategory(name, description);
      set((state) => ({ categories: [response, ...state.categories], isLoading: false }));
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryService.updateCategory(categoryId, categoryData);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === categoryId ? response : c)),
        currentCategory: state.currentCategory?.id === categoryId ? response : state.currentCategory,
        isLoading: false,
      }));
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.deleteCategory(categoryId);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
        currentCategory: state.currentCategory?.id === categoryId ? null : state.currentCategory,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentCategory: () => set({ currentCategory: null }),
}));

export default useCategoryStore;
