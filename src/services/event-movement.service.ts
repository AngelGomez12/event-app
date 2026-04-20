import apiClient from './apiClient';

export interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  eventId: string;
}

export const eventMovementService = {
  findAll: async (eventId: string): Promise<Movement[]> => {
    try {
      const response = await apiClient.get(`/events/${eventId}/movements`);
      return response.data.data || [];
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
