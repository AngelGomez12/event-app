import api from "@/lib/axios";
import { Tenant, OnboardingRegisterDto, PaginatedResponse } from '@/lib/api';

export interface TenantFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export const tenantService = {
  getAll: async (filters: TenantFilters = {}): Promise<PaginatedResponse<Tenant>> => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/tenants?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener los salones');
    }
  },

  getById: async (id: string): Promise<Tenant> => {
    try {
      const response = await api.get(`/tenants/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener los detalles del salón');
    }
  },

  getTenantPayments: async (id: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<any>> => {
    try {
      const response = await api.get(`/tenants/${id}/payments?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener el historial de pagos');
    }
  },

  create: async (name: string, customDomain: string): Promise<Tenant> => {
    try {
      const response = await api.post('/tenants', { name, customDomain });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al crear el Salón');
    }
  },

  onboard: async (data: OnboardingRegisterDto): Promise<any> => {
    try {
      const response = await api.post('/onboarding/register', data);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error en el registro del Salón');
    }
  },

  getStats: async (): Promise<any> => {
    try {
      const response = await api.get('/tenants/stats');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener estadísticas');
    }
  },

  updateStatus: async (id: string, status: string): Promise<Tenant> => {
    try {
      const response = await api.patch(`/tenants/${id}/status`, { status });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al actualizar el estado del salón');
    }
  },

  update: async (id: string, data: Partial<Tenant>): Promise<Tenant> => {
    try {
      const response = await api.patch(`/tenants/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al actualizar el salón');
    }
  },

  getMe: async (): Promise<Tenant> => {
    try {
      const response = await api.get('/tenants/me');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener mi salón');
    }
  },

  updateMe: async (data: Partial<Tenant>): Promise<Tenant> => {
    try {
      const response = await api.patch('/tenants/me', data);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al actualizar mi salón');
    }
  },

  getPaymentLink: async (email: string): Promise<any> => {
    try {
      const response = await api.get(`/onboarding/payment-link?email=${email}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener el link de pago');
    }
  },

  checkPayment: async (paymentId: string): Promise<any> => {
    try {
      const response = await api.get(`/onboarding/check-payment?payment_id=${paymentId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al verificar el pago');
    }
  }
};
