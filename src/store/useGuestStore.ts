import { create } from 'zustand';
import { guestService } from '@/services/guest.service';
import { PaginationMeta } from '@/lib/api';

export interface Invitado {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  restriccionAlimentaria?: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  mesaId?: string;
  asistio?: boolean;
}

export type TableType = 'round' | 'square' | 'rectangle';

export interface Mesa {
  id: string;
  nombre: string;
  x: number;
  y: number;
  rotation: number;
  type: TableType;
  seats: number;
  color: string;
  scale: number;
  isStructural: boolean;
}

export type FloorPlanElementType = 'divider' | 'text' | 'shape' | 'stage';

export interface FloorPlanElement {
  id: string;
  type: FloorPlanElementType;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  order: number;
  isStructural: boolean;
}

interface GuestState {
  invitados: Invitado[];
  mesas: Mesa[];
  isLoading: boolean;
  error: string | null;
  currentEventId: string | null;
  // Pagination
  pagination: PaginationMeta;
  
  fetchInvitados: (eventoId: string, page?: number, limit?: number, search?: string) => Promise<void>;
  fetchMesas: (eventoId: string) => Promise<void>;
  setMesas: (mesas: Mesa[]) => void;
  updateMesa: (eventoId: string, id: string, mesa: Partial<Mesa>) => Promise<void>;
  addInvitado: (eventoId: string, invitado: Omit<Invitado, 'id'>) => Promise<void>;
  updateInvitado: (eventoId: string, id: string, invitado: Partial<Invitado>) => Promise<void>;
  removeInvitado: (eventoId: string, id: string) => Promise<void>;
  updateEstadoInvitado: (id: string, nuevoEstado: Invitado['estado']) => Promise<void>;
  assignMesa: (id: string, mesaId: string) => Promise<void>;
  addMesa: (eventoId: string, mesa: Partial<Mesa>) => Promise<void>;
  checkInInvitado: (eventoId: string, invitadoId: string) => Promise<Invitado>;
  sendTicket: (eventoId: string, invitadoId: string) => Promise<void>;
}

export const useGuestStore = create<GuestState>((set, get) => ({
  invitados: [],
  mesas: [],
  isLoading: false,
  error: null,
  currentEventId: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },

  fetchInvitados: async (eventoId, page, limit, search) => {
    const { pagination } = get();
    set({ isLoading: true, error: null, currentEventId: eventoId });
    try {
      const response = await guestService.getInvitados(
        eventoId, 
        page || pagination.page, 
        limit || pagination.limit, 
        search
      );
      set({ 
        invitados: response.data, 
        pagination: response.meta,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Error al cargar invitados', isLoading: false });
    }
  },

  fetchMesas: async (eventoId) => {
    set({ isLoading: true, error: null, currentEventId: eventoId });
    try {
      const data = await guestService.getMesas(eventoId);
      set({ mesas: data, isLoading: false });
    } catch (error) {
      set({ error: 'Error al cargar mesas', isLoading: false });
    }
  },

  setMesas: (mesas) => set({ mesas }),

  updateMesa: async (eventoId, id, mesa) => {
    try {
      const actualizada = await guestService.updateMesa(eventoId, id, mesa);
      set((state) => ({
        mesas: state.mesas.map(m => m.id === id ? actualizada : m)
      }));
    } catch (error) {
      set({ error: 'Error al actualizar mesa' });
    }
  },

  addInvitado: async (eventoId, invitado) => {
      set({ isLoading: true, error: null });
      try {
          const nuevoInvitado = await guestService.addInvitado(eventoId, invitado);
          set((state) => ({
              invitados: [...state.invitados, nuevoInvitado],
              isLoading: false
          }));
      } catch (error) {
          set({ error: 'Error al agregar invitado', isLoading: false });
      }
  },

  updateInvitado: async (eventoId, id, invitado) => {
    set({ isLoading: true, error: null });
    try {
      const actualizado = await guestService.updateInvitado(eventoId, id, invitado);
      set((state) => ({
        invitados: state.invitados.map(inv => inv.id === id ? actualizado : inv),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Error al actualizar invitado', isLoading: false });
    }
  },

  removeInvitado: async (eventoId, id) => {
    set({ isLoading: true, error: null });
    try {
      await guestService.removeInvitado(eventoId, id);
      set((state) => ({
        invitados: state.invitados.filter(inv => inv.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Error al eliminar invitado', isLoading: false });
    }
  },

  updateEstadoInvitado: async (id, nuevoEstado) => {
    const { currentEventId } = get();
    if (!currentEventId) {
      set({ error: 'No se pudo identificar el evento' });
      return;
    }
    
    try {
      await guestService.updateEstado(currentEventId, id, nuevoEstado);
      set((state) => ({
        invitados: state.invitados.map(inv => 
          inv.id === id ? { ...inv, estado: nuevoEstado } : inv
        )
      }));
    } catch (error) {
      set({ error: 'No se pudo actualizar el estado' });
    }
  },

  assignMesa: async (id, mesaId) => {
      const { currentEventId } = get();
      if (!currentEventId) {
        set({ error: 'No se pudo identificar el evento' });
        return;
      }

      try {
          await guestService.assignMesa(currentEventId, id, mesaId === 'none' ? null : mesaId);
          set((state) => ({
              invitados: state.invitados.map(inv =>
                  inv.id === id ? { ...inv, mesaId: mesaId === 'none' ? undefined : mesaId } : inv
              )
          }));
      } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'No se pudo asignar mesa';
          set({ error: message });
      }
  },

  addMesa: async (eventoId: string, mesa: Partial<Mesa>) => {
      try {
          const nuevaMesa = await guestService.addMesa(eventoId, mesa);
          set((state) => ({
              mesas: [...state.mesas, nuevaMesa]
          }));
      } catch (error) {
          set({ error: 'Error al agregar mesa' });
      }
  },

  checkInInvitado: async (eventoId, invitadoId) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Verificamos cache local rápida (por si escanean dos veces)
      const { invitados } = get();
      let targetGuest = invitados.find(inv => inv.id === invitadoId);

      // 2. Usamos el nuevo servicio de Check-In quirúrgico
      if (!targetGuest) {
        targetGuest = await guestService.checkIn(eventoId, invitadoId);
        // Guardamos en el store para tenerlo en memoria
        set((state) => ({ 
          invitados: [...state.invitados, targetGuest!],
          isLoading: false
        }));
      } else {
        // Si ya estaba, igual lo llamamos para validar en servidor (o actualizamos local)
        targetGuest = await guestService.checkIn(eventoId, invitadoId);
        set((state) => ({
          invitados: state.invitados.map(inv => inv.id === invitadoId ? targetGuest! : inv),
          isLoading: false
        }));
      }

      return targetGuest;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  sendTicket: async (eventoId: string, invitadoId: string) => {
    set({ isLoading: true, error: null });
    try {
      await guestService.sendTicket(eventoId, invitadoId);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));
