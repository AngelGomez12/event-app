import { create } from 'zustand';
import { tenantService } from '@/services/tenant.service';
import { Tenant } from '@/lib/api';

export interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  pendingTenants: number;
  suspendedTenants: number;
  mrr: number;
}

interface TenantState {
  tenants: Tenant[];
  stats: TenantStats | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchTenants: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addTenant: (name: string, customDomain: string) => Promise<void>;
  updateTenantStatus: (id: string, status: string) => Promise<void>;
  updateTenant: (id: string, data: Partial<Tenant>) => Promise<void>;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenants: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchTenants: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await tenantService.getAll();
      set({ tenants: data, isLoading: false });
    } catch (error: unknown) {
      const err = error as Error;
      set({ error: err.message || 'Error al cargar los salones', isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await tenantService.getStats();
      set({ stats });
    } catch (error: unknown) {
      console.error('Error al cargar estadísticas', error);
    }
  },

  addTenant: async (name: string, customDomain: string) => {
    set({ isLoading: true, error: null });
    try {
      const tenantCreado = await tenantService.create(name, customDomain);
      set((state) => ({
        tenants: [...state.tenants, tenantCreado],
        isLoading: false,
      }));
    } catch (error: unknown) {
      const err = error as Error;
      set({ error: err.message || 'Error al crear el Salón', isLoading: false });
      throw error;
    }
  },

  updateTenantStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTenant = await tenantService.updateStatus(id, status);
      set((state) => ({
        tenants: state.tenants.map(t => t.id === id ? updatedTenant : t),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const err = error as Error;
      set({ error: err.message || 'Error al actualizar estado', isLoading: false });
      throw error;
    }
    },

    updateTenant: async (id: string, data: Partial<Tenant>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTenant = await tenantService.update(id, data);
      set((state) => ({
        tenants: state.tenants.map(t => t.id === id ? updatedTenant : t),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const err = error as Error;
      set({ error: err.message || 'Error al actualizar salón', isLoading: false });
      throw error;
    }
    }
    }));