import api from './api';

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price_at_time: number;
  product?: {
    id: number;
    name: string;
    image_url: string | null;
    price: number;
    stock: number;
  };
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
}

export interface CartFilters {
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

const cartService = {
  getCart: async (): Promise<Cart> => {
    try {
      const response = await api.get<Cart>('/cart');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  listCartItems: async (filters: CartFilters = {}): Promise<CartItem[]> => {
    try {
      const params = {
        skip: filters.skip || 0,
        limit: filters.limit || 10,
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      };

      const response = await api.get<CartItem[]>('/cart/items', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  addItemToCart: async (product_id: number, quantity: number): Promise<CartItem> => {
    try {
      const response = await api.post<CartItem>('/cart/items', { product_id, quantity });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  updateCartItem: async (item_id: number, quantity: number): Promise<CartItem> => {
    try {
      const response = await api.put<CartItem>(`/cart/items/${item_id}`, null, {
        params: { quantity },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  removeItemFromCart: async (item_id: number): Promise<void> => {
    try {
      await api.delete(`/cart/items/${item_id}`);
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  clearCart: async (): Promise<void> => {
    try {
      await api.delete('/cart');
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default cartService;
