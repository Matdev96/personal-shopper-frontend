import { create } from 'zustand';
import cartService, { Cart, CartItem, CartFilters } from '../services/cartService';

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  totalPrice: number;

  fetchCart: () => Promise<Cart>;
  fetchCartItems: (filters?: CartFilters) => Promise<CartItem[]>;
  addItem: (product_id: number, quantity: number) => Promise<CartItem>;
  updateItem: (item_id: number, quantity: number) => Promise<CartItem>;
  removeItem: (item_id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getTotalPrice: () => number;
  clearError: () => void;
}

const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  items: [],
  isLoading: false,
  error: null,
  totalPrice: 0,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.getCart();
      set({ cart: response, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  fetchCartItems: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.listCartItems(filters);
      const totalPrice = response.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);
      set({ items: response, totalPrice, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  addItem: async (product_id, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.addItemToCart(product_id, quantity);
      const items = [...get().items];
      const existingIndex = items.findIndex((item) => item.product_id === product_id);

      if (existingIndex !== -1) {
        items[existingIndex] = { ...items[existingIndex], quantity: response.quantity };
      } else {
        items.push(response);
      }

      const totalPrice = items.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);
      set({ items, totalPrice, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  updateItem: async (item_id, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.updateCartItem(item_id, quantity);
      const items = get().items.map((item) => (item.id === item_id ? response : item));
      const totalPrice = items.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);
      set({ items, totalPrice, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  removeItem: async (item_id) => {
    set({ isLoading: true, error: null });
    try {
      await cartService.removeItemFromCart(item_id);
      const items = get().items.filter((item) => item.id !== item_id);
      const totalPrice = items.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0);
      set({ items, totalPrice, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart();
      set({ items: [], totalPrice: 0, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  getItemCount: () => get().items.length,
  getTotalPrice: () => get().totalPrice,
  clearError: () => set({ error: null }),
}));

export default useCartStore;
