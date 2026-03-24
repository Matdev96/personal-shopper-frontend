import api from './api';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_time: number;
  product?: { id: number; name: string; image_url: string | null };
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  shipping_address: string;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface CreateOrderData {
  items: { product_id: number; quantity: number }[];
  shipping_address: string;
  payment_method: string;
}

export interface OrderFilters {
  skip?: number;
  limit?: number;
  status_filter?: OrderStatus;
  min_date?: string;
  max_date?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

const orderService = {
  listOrders: async (filters: OrderFilters = {}): Promise<Order[]> => {
    try {
      const params = {
        skip: filters.skip || 0,
        limit: filters.limit || 10,
        ...(filters.status_filter && { status_filter: filters.status_filter }),
        ...(filters.min_date && { min_date: filters.min_date }),
        ...(filters.max_date && { max_date: filters.max_date }),
        ...(filters.min_price !== undefined && { min_price: filters.min_price }),
        ...(filters.max_price !== undefined && { max_price: filters.max_price }),
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      };

      const response = await api.get<Order[]>('/orders', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getOrderById: async (order_id: number): Promise<Order> => {
    try {
      const response = await api.get<Order>(`/orders/${order_id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    try {
      const response = await api.post<Order>('/orders', orderData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  cancelOrder: async (order_id: number): Promise<Order> => {
    try {
      const response = await api.put<Order>(`/orders/${order_id}/cancel`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getOrderStatus: async (order_id: number): Promise<{ order_id: number; status: OrderStatus }> => {
    try {
      const response = await api.get(`/orders/${order_id}/status`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  updateOrderStatus: async (order_id: number, new_status: OrderStatus): Promise<Order> => {
    try {
      const response = await api.put<Order>(`/orders/${order_id}/status`, null, {
        params: { new_status },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default orderService;
