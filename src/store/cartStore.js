import { create } from 'zustand';
import cartService from '../services/cartService';

const useCartStore = create((set, get) => ({
  cart: null,
  items: [],
  isLoading: false,
  error: null,
  totalPrice: 0,

  // Obter carrinho do usuário
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.getCart();
      set({ cart: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Listar itens do carrinho
  fetchCartItems: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.listCartItems(filters);
      const totalPrice = response.reduce((sum, item) => {
        return sum + (item.price_at_time * item.quantity);
      }, 0);
      set({ items: response, totalPrice, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Adicionar item ao carrinho
  addItem: async (product_id, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.addItemToCart(product_id, quantity);
      // Atualizar lista de itens
      const items = get().items;
      const existingItem = items.find(item => item.product_id === product_id);
      
      if (existingItem) {
        existingItem.quantity = response.quantity;
      } else {
        items.push(response);
      }
      
      // Recalcular total
      const totalPrice = items.reduce((sum, item) => {
        return sum + (item.price_at_time * item.quantity);
      }, 0);
      
      set({ items, totalPrice, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Atualizar quantidade de um item
  updateItem: async (item_id, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.updateCartItem(item_id, quantity);
      
      // Atualizar item na lista
      const items = get().items;
      const itemIndex = items.findIndex(item => item.id === item_id);
      
      if (itemIndex !== -1) {
        items[itemIndex] = response;
      }
      
      // Recalcular total
      const totalPrice = items.reduce((sum, item) => {
        return sum + (item.price_at_time * item.quantity);
      }, 0);
      
      set({ items, totalPrice, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Remover item do carrinho
  removeItem: async (item_id) => {
    set({ isLoading: true, error: null });
    try {
      await cartService.removeItemFromCart(item_id);
      
      // Remover item da lista
      const items = get().items.filter(item => item.id !== item_id);
      
      // Recalcular total
      const totalPrice = items.reduce((sum, item) => {
        return sum + (item.price_at_time * item.quantity);
      }, 0);
      
      set({ items, totalPrice, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Limpar carrinho
  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart();
      set({ items: [], totalPrice: 0, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Obter quantidade de itens no carrinho
  getItemCount: () => {
    return get().items.length;
  },

  // Obter preço total
  getTotalPrice: () => {
    return get().totalPrice;
  },

  // Limpar erro
  clearError: () => {
    set({ error: null });
  },
}));

export default useCartStore;