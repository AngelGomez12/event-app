import { create } from 'zustand';
import { notificationService, GlobalNotification } from '@/services/notification.service';
import { PaginationMeta } from '@/lib/api';

interface NotificationState {
  notifications: GlobalNotification[];
  activeNotifications: GlobalNotification[];
  isLoading: boolean;
  pagination: PaginationMeta;
  
  fetchNotifications: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchActiveNotifications: () => Promise<void>;
  addNotification: (data: Partial<GlobalNotification>) => Promise<void>;
  updateNotification: (id: string, data: Partial<GlobalNotification>) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  activeNotifications: [],
  isLoading: false,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },

  fetchNotifications: async (page, limit, search) => {
    const { pagination } = get();
    set({ isLoading: true });
    try {
      const response = await notificationService.getAll(
        page || pagination.page, 
        limit || pagination.limit,
        search
      );
      set({ 
        notifications: response.data, 
        pagination: response.meta,
        isLoading: false 
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  fetchActiveNotifications: async () => {
    try {
      const activeNotifications = await notificationService.getActive();
      set({ activeNotifications });
    } catch (error) {
      console.error(error);
    }
  },

  addNotification: async (data) => {
    set({ isLoading: true });
    try {
      const newNotification = await notificationService.create(data);
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateNotification: async (id, data) => {
    try {
      const updated = await notificationService.update(id, data);
      set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? updated : n),
        activeNotifications: state.activeNotifications.map(n => n.id === id ? updated : n)
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationService.remove(id);
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
        activeNotifications: state.activeNotifications.filter(n => n.id !== id)
      }));
    } catch (error) {
      throw error;
    }
  },
}));
