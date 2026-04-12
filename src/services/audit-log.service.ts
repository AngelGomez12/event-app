import apiClient from './apiClient';

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  tenantId: string;
  action: string;
  entity: string;
  entityId: string;
  payload: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export const auditLogService = {
  getAll: async (page = 1, limit = 50): Promise<{ data: AuditLog[], meta: any }> => {
    try {
      const response = await apiClient.get(`/audit-logs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs', error);
      return { data: [], meta: {} };
    }
  },
};
