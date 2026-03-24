import { create } from 'zustand';
import productService, { Product, ProductFilters, ProductListResponse } from '../services/productService';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;

  fetchProducts: (filters?: ProductFilters) => Promise<ProductListResponse>;
  fetchProductById: (productId: number) => Promise<Product>;
  createProduct: (productData: Partial<Product>) => Promise<Product>;
  updateProduct: (productId: number, productData: Partial<Product>) => Promise<Product>;
  uploadProductImage: (productId: number, file: File) => Promise<{ message: string; product: Product }>;
  deleteProduct: (productId: number) => Promise<void>;
  searchProducts: (searchTerm: string, filters?: ProductFilters) => Promise<ProductListResponse>;
  filterByCategory: (categoryId: number, filters?: ProductFilters) => Promise<ProductListResponse>;
  filterByPrice: (minPrice: number, maxPrice: number, filters?: ProductFilters) => Promise<ProductListResponse>;
  filterInStock: (filters?: ProductFilters) => Promise<ProductListResponse>;
  clearError: () => void;
  clearCurrentProduct: () => void;
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,

  // Listar produtos com filtros — agora retorna resposta paginada
  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.listProducts(filters);
      set({
        products: response.items,
        total: response.total,
        currentPage: response.page,
        totalPages: response.pages,
        pageSize: filters.limit || 10,
        isLoading: false,
      });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  fetchProductById: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProductById(productId);
      set({ currentProduct: response, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.createProduct(productData);
      set((state) => ({ products: [response, ...state.products], isLoading: false }));
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.updateProduct(productId, productData);
      set((state) => ({
        products: state.products.map((p) => (p.id === productId ? response : p)),
        currentProduct: state.currentProduct?.id === productId ? response : state.currentProduct,
        isLoading: false,
      }));
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  uploadProductImage: async (productId, file) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.uploadProductImage(productId, file);
      set((state) => ({
        products: state.products.map((p) => (p.id === productId ? response.product : p)),
        currentProduct: state.currentProduct?.id === productId ? response.product : state.currentProduct,
        isLoading: false,
      }));
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      await productService.deleteProduct(productId);
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
        currentProduct: state.currentProduct?.id === productId ? null : state.currentProduct,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  searchProducts: async (searchTerm, filters = {}) => {
    return get().fetchProducts({ ...filters, search: searchTerm });
  },

  filterByCategory: async (categoryId, filters = {}) => {
    return get().fetchProducts({ ...filters, category_id: categoryId });
  },

  filterByPrice: async (minPrice, maxPrice, filters = {}) => {
    return get().fetchProducts({ ...filters, min_price: minPrice, max_price: maxPrice });
  },

  filterInStock: async (filters = {}) => {
    return get().fetchProducts({ ...filters, in_stock: true });
  },

  clearError: () => set({ error: null }),
  clearCurrentProduct: () => set({ currentProduct: null }),
}));

export default useProductStore;
