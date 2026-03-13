import { create } from 'zustand';
import orderService from '../services/orderService';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  totalOrders: 0,

  // Listar pedidos do usuário
  fetchOrders: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.listOrders(filters);
      set({
        orders: response,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Obter pedido por ID
  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getOrderById(orderId);
      set({ currentOrder: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Criar novo pedido
  createOrder: async (orderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.createOrder(orderData);
      
      // Adicionar novo pedido à lista
      const orders = get().orders;
      orders.unshift(response);
      
      set({ orders, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Cancelar pedido
  cancelOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.cancelOrder(orderId);
      
      // Atualizar pedido na lista
      const orders = get().orders;
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex] = response;
      }
      
      // Atualizar pedido atual se for o mesmo
      if (get().currentOrder?.id === orderId) {
        set({ currentOrder: response });
      }
      
      set({ orders, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Obter status do pedido
  fetchOrderStatus: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getOrderStatus(orderId);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Atualizar status do pedido
  updateOrderStatus: async (orderId, newStatus) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      
      // Atualizar pedido na lista
      const orders = get().orders;
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex] = response;
      }
      
      // Atualizar pedido atual se for o mesmo
      if (get().currentOrder?.id === orderId) {
        set({ currentOrder: response });
      }
      
      set({ orders, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Filtrar pedidos por status
  filterByStatus: async (status, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.listOrders({
        ...filters,
        status_filter: status,
      });
      set({ orders: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Filtrar pedidos por data
  filterByDate: async (minDate, maxDate, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.listOrders({
        ...filters,
        min_date: minDate,
        max_date: maxDate,
      });
      set({ orders: response, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.detail || error.message });
      throw error;
    }
  },

  // Filtrar pedidos por preço
  filterByPrice: async (minPrice, maxPrice, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.listOrders({
        ...filters,
        min_price: minPrice,
        max_price: maxPrice,
      });
      set({ orders: response, isLoading: false });
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

  // Limpar pedido atual
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));

export default useOrderStore;