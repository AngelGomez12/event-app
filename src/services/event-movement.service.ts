import apiClient from './apiClient';
import { PaginatedResponse } from '@/lib/api';

export interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  eventId: string;
}

export const eventMovementService = {
  findAll: async (eventId: string, page: number = 1, limit: number = 20, search?: string): Promise<PaginatedResponse<Movement>> => {
    try {
      const url = search 
        ? `/events/${eventId}/movements?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        : `/events/${eventId}/movements?page=${page}&limit=${limit}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener los movimientos');
    }
  },

  create: async (eventId: string, movement: Omit<Movement, 'id' | 'eventId'>): Promise<Movement> => {
    try {
      const response = await apiClient.post(`/events/${eventId}/movements`, movement);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar el movimiento');
    }
  },

  remove: async (eventId: string, movementId: string): Promise<void> => {
    try {
      await apiClient.delete(`/events/${eventId}/movements/${movementId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el movimiento');
    }
  }
};
