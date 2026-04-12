import { create } from 'zustand';
import { auditLogService, AuditLog } from '@/services/audit-log.service';

interface AuditLogState {
  logs: AuditLog[];
  meta: any;
  isLoading: boolean;
  
  fetchLogs: (page?: number, limit?: number) => Promise<void>;
}

export const useAuditLogStore = create<AuditLogState>((set) => ({
  logs: [],
  meta: {},
  isLoading: false,

  fetchLogs: async (page = 1, limit = 50) => {
    set({ isLoading: true });
    try {
      const response = await auditLogService.getAll(page, limit);
      set({ logs: response.data, meta: response.meta, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
