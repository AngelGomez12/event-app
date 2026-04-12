import apiClient from './apiClient';

export interface GlobalNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive: boolean;
  createdAt: string;
}

export const notificationService = {
  getActive: async (): Promise<GlobalNotification[]> => {
    try {
      const response = await apiClient.get('/notifications');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active notifications', error);
      return [];
    }
  },

  getAll: async (): Promise<GlobalNotification[]> => {
    try {
      const response = await apiClient.get('/notifications/all');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching all notifications', error);
      return [];
    }
  },

  create: async (data: Partial<GlobalNotification>): Promise<GlobalNotification> => {
    try {
      const response = await apiClient.post('/notifications', data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear notificación');
    }
  },

  update: async (id: string, data: Partial<GlobalNotification>): Promise<GlobalNotification> => {
    try {
      const response = await apiClient.patch(`/notifications/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar notificación');
    }
  },

  remove: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar notificación');
    }
  },
};
