import apiClient from './apiClient';
import { Evento } from '@/store/useEventStore';

export const eventService = {
  getAll: async (): Promise<Evento[]> => {
    try {
      const response = await apiClient.get('/eventos');
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener los eventos');
    }
  },

  create: async (evento: Omit<Evento, 'id'>): Promise<Evento> => {
    try {
      const response = await apiClient.post('/eventos', evento);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al crear el evento');
    }
  }
};
