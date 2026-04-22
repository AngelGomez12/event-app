import apiClient from "./apiClient";

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  tenantId: string;
  action: string;
  entity: string;
  entityId: string;
  payload: unknown;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface AuditLogMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AuditLogResponse {
  data: AuditLog[];
  meta: AuditLogMeta;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export const auditLogService = {
  getAll: async (filters: AuditLogFilters = {}): Promise<AuditLogResponse> => {
    try {
      const paramas = new URLSearchParams();
      if (filters.page) paramas.append("page", filters.page.toString());
      if (filters.limit) paramas.append("limit", filters.limit.toString());
      if (filters.search) paramas.append("search", filters.search);

      const response = await apiClient.get(`/audit-logs?${paramas.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching audit logs", error);
      return {
        data: [],
        meta: {
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 50,
          totalPages: 1,
        },
      };
    }
  },

  getMyLogs: async (page = 1, limit = 10): Promise<AuditLogResponse> => {
    try {
      const response = await apiClient.get(
        `/audit-logs/me?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching my audit logs", error);
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 1,
        },
      };
    }
  },
};
