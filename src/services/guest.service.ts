import apiClient from './apiClient';
import { Invitado, Mesa } from '@/store/useGuestStore';

export const guestService = {
  getInvitados: async (eventoId: string): Promise<Invitado[]> => {
    try {
      const response = await apiClient.get(`/eventos/${eventoId}/invitados`);
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener los invitados');
    }
  },

  addInvitado: async (invitado: Omit<Invitado, 'id'>): Promise<Invitado> => {
    try {
      const response = await apiClient.post('/invitados', invitado);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al agregar el invitado');
    }
  },

  updateEstado: async (id: string, nuevoEstado: Invitado['estado']): Promise<void> => {
    try {
      await apiClient.patch(`/invitados/${id}`, { estado: nuevoEstado });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo actualizar el estado');
    }
  },

  assignMesa: async (id: string, mesaId: string | undefined): Promise<void> => {
    try {
      await apiClient.patch(`/invitados/${id}`, { mesaId });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('No se pudo asignar la mesa');
    }
  },

  getMesas: async (eventoId: string): Promise<Mesa[]> => {
    try {
      const response = await apiClient.get(`/eventos/${eventoId}/mesas`);
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener las mesas');
    }
  },

  addMesa: async (mesa: Omit<Mesa, 'id'>): Promise<Mesa> => {
    try {
      const response = await apiClient.post('/mesas', mesa);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al crear la mesa');
    }
  }
};
