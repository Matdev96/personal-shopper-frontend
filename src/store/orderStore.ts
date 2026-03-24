import { create } from 'zustand';
import orderService, { Order, OrderStatus, CreateOrderData, OrderFilters } from '../services/orderService';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  fetchOrders: (filters?: OrderFilters) => Promise<Order[]>;
  fetchOrderById: (orderId: number) => Promise<Order>;
  createOrder: (orderData: CreateOrderData) => Promise<Order>;
  cancelOrder: (orderId: number) => Promise<Order>;
  fetchOrderStatus: (orderId: number) => Promise<{ order_id: number; status: OrderStatus }>;
  updateOrderStatus: (orderId: number, newStatus: OrderStatus) => Promise<Order>;
  filterByStatus: (status: OrderStatus, filters?: OrderFilters) => Promise<Order[]>;
  filterByDate: (minDate: string, maxDate: string, filters?: OrderFilters) => Promise<Order[]>;
  filterByPrice: (minPrice: number, maxPrice: number, filters?: OrderFilters) => Promise<Order[]>;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.listOrders(filters);
      set({ orders: response, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getOrderById(orderId);
      set({ currentOrder: response, isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.createOrder(orderData);
      set((state) => ({ orders: [response, ...state.orders], isLoading: false }));
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.cancelOrder(orderId);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? response : o)),
        currentOrder: state.currentOrder?.id === orderId ? response : state.currentOrder,
        isLoading: false,
      }));
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  fetchOrderStatus: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getOrderStatus(orderId);
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? response : o)),
        currentOrder: state.currentOrder?.id === orderId ? response : state.currentOrder,
        isLoading: false,
      }));
      return response;
    } catch (error: any) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  filterByStatus: async (status, filters = {}) => {
    return get().fetchOrders({ ...filters, status_filter: status });
  },

  filterByDate: async (minDate, maxDate, filters = {}) => {
    return get().fetchOrders({ ...filters, min_date: minDate, max_date: maxDate });
  },

  filterByPrice: async (minPrice, maxPrice, filters = {}) => {
    return get().fetchOrders({ ...filters, min_price: minPrice, max_price: maxPrice });
  },

  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null }),
}));

export default useOrderStore;
