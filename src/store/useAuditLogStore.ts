import { create } from "zustand";
import { auditLogService, AuditLog } from "@/services/audit-log.service";

interface AuditLogState {
  logs: AuditLog[];
  myLogs: AuditLog[];
  meta: any;
  isLoading: boolean;

  fetchLogs: (page?: number, limit?: number, search?: string) => Promise<void>;
  fetchMyLogs: (page?: number, limit?: number) => Promise<void>;
}

export const useAuditLogStore = create<AuditLogState>((set) => ({
  logs: [],
  myLogs: [],
  meta: {},
  isLoading: false,

  fetchLogs: async (page = 1, limit = 50, search) => {
    set({ isLoading: true });
    try {
      const response = await auditLogService.getAll({ page, limit, search });
      set({ logs: response.data, meta: response.meta, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  fetchMyLogs: async (page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await auditLogService.getMyLogs(page, limit);
      set({ myLogs: response.data, meta: response.meta, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));
