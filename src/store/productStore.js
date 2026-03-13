import { create } from 'zustand';
import productService from '../services/productService';

const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  totalProducts: 0,
  currentPage: 0,
  pageSize: 10,

  // Listar produtos com filtros
  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.listProducts(filters);
      set({
        products: response,
        currentPage: filters.skip ? Math.floor(filters.skip / (filters.limit || 10)) : 0,
        pageSize: filters.limit || 10,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Obter produto por ID
  fetchProductById: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProductById(productId);
      set({ currentProduct: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Criar novo produto (admin)
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.createProduct(productData);
      
      // Adicionar novo produto à lista
      const products = get().products;
      products.unshift(response);
      
      set({ products, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Atualizar produto (admin)
  updateProduct: async (productId, productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.updateProduct(productId, productData);
      
      // Atualizar produto na lista
      const products = get().products;
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex !== -1) {
        products[productIndex] = response;
      }
      
      // Atualizar produto atual se for o mesmo
      if (get().currentProduct?.id === productId) {
        set({ currentProduct: response });
      }
      
      set({ products, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Fazer upload de imagem para produto (admin)
  uploadProductImage: async (productId, file) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.uploadProductImage(productId, file);
      
      // Atualizar produto na lista
      const products = get().products;
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex !== -1) {
        products[productIndex] = response.product;
      }
      
      // Atualizar produto atual se for o mesmo
      if (get().currentProduct?.id === productId) {
        set({ currentProduct: response.product });
      }
      
      set({ products, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Deletar produto (admin)
  deleteProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      await productService.deleteProduct(productId);
      
      // Remover produto da lista
      const products = get().products.filter(p => p.id !== productId);
      
      // Limpar produto atual se for o mesmo
      if (get().currentProduct?.id === productId) {
        set({ currentProduct: null });
      }
      
      set({ products, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Buscar produtos por termo
  searchProducts: async (searchTerm, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.listProducts({
        ...filters,
        search: searchTerm,
      });
      set({ products: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Filtrar produtos por categoria
  filterByCategory: async (categoryId, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.listProducts({
        ...filters,
        category_id: categoryId,
      });
      set({ products: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Filtrar produtos por preço
  filterByPrice: async (minPrice, maxPrice, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.listProducts({
        ...filters,
        min_price: minPrice,
        max_price: maxPrice,
      });
      set({ products: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Filtrar produtos em estoque
  filterInStock: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.listProducts({
        ...filters,
        in_stock: true,
      });
      set({ products: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Limpar erro
  clearError: () => {
    set({ error: null });
  },

  // Limpar produto atual
  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
}));

export default useProductStore;