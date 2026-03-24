import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string | null;
  color: string | null;
  category_id: number;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductFilters {
  skip?: number;
  limit?: number;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

const productService = {
  listProducts: async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
    try {
      const params = {
        skip: filters.skip || 0,
        limit: filters.limit || 10,
        ...(filters.category_id && { category_id: filters.category_id }),
        ...(filters.min_price !== undefined && { min_price: filters.min_price }),
        ...(filters.max_price !== undefined && { max_price: filters.max_price }),
        ...(filters.in_stock !== undefined && { in_stock: filters.in_stock }),
        ...(filters.search && { search: filters.search }),
        sort_by: filters.sort_by || 'created_at',
        sort_order: filters.sort_order || 'desc',
      };

      const response = await api.get<ProductListResponse>('/products', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getProductById: async (productId: number): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    try {
      const response = await api.post<Product>('/products', productData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  updateProduct: async (productId: number, productData: Partial<Product>): Promise<Product> => {
    try {
      const response = await api.put<Product>(`/products/${productId}`, productData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  uploadProductImage: async (productId: number, file: File): Promise<{ message: string; product: Product }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ message: string; product: Product }>('/products/upload', formData, {
        params: { product_id: productId },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  deleteProduct: async (productId: number): Promise<void> => {
    try {
      await api.delete(`/products/${productId}`);
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default productService;
