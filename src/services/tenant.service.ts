import api from "@/lib/axios";
import { Tenant, OnboardingRegisterDto } from '@/lib/api';

export const tenantService = {
  getAll: async (): Promise<Tenant[]> => {
    try {
      const response = await api.get('/tenants');
      // Extraemos la data del interceptor del backend
      return response.data.data || [];
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener los salones');
    }
  },

  create: async (name: string, customDomain: string): Promise<Tenant> => {
    try {
      const response = await api.post('/tenants', { name, customDomain });
      // Extraemos la data del interceptor del backend
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
      // Extraemos la data del interceptor del backend (initPoint, etc)
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

