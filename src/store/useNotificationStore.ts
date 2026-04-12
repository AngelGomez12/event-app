import { create } from 'zustand';
import { notificationService, GlobalNotification } from '@/services/notification.service';

interface NotificationState {
  notifications: GlobalNotification[];
  activeNotifications: GlobalNotification[];
  isLoading: boolean;
  
  fetchNotifications: () => Promise<void>;
  fetchActiveNotifications: () => Promise<void>;
  addNotification: (data: Partial<GlobalNotification>) => Promise<void>;
  updateNotification: (id: string, data: Partial<GlobalNotification>) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  activeNotifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = await notificationService.getAll();
      set({ notifications, isLoading: false });
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
