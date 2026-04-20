import apiClient from './apiClient';
import { Event, CreateEventDto, EventStatus } from '@/lib/api';

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    try {
      const response = await apiClient.get('/events');
      return response.data.data || [];
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener los eventos');
    }
  },

  getById: async (id: string): Promise<Event> => {
    try {
      const response = await apiClient.get(`/events/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener los detalles del evento');
    }
  },

  create: async (data: CreateEventDto): Promise<Event> => {
    try {
      const response = await apiClient.post('/events', data);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al crear el evento');
    }
  },

  updateStatus: async (id: string, status: EventStatus): Promise<Event> => {
    try {
      const response = await apiClient.patch(`/events/${id}/status`, { status });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al actualizar el estado del evento');
    }
  },

  updatePrice: async (id: string, basePrice: number): Promise<Event> => {
    try {
      const response = await apiClient.patch(`/events/${id}/price`, { basePrice });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al actualizar el precio base');
    }
  },

  updateTableLimit: async (id: string, maxTableCount: number): Promise<Event> => {
    try {
      const response = await apiClient.patch(`/events/${id}/table-limit`, { maxTableCount });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al actualizar el límite de mesas');
    }
  },

  addPayment: async (id: string, paymentData: any): Promise<any> => {
    try {
      const response = await apiClient.post(`/events/${id}/payments`, paymentData);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al registrar el pago');
    }
  },

  removePayment: async (id: string, paymentId: string): Promise<void> => {
    try {
      await apiClient.delete(`/events/${id}/payments/${paymentId}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al eliminar el pago');
    }
  }
};
