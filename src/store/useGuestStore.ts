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

export interface Mesa {
  id: string;
  nombre: string;
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
  addInvitado: (eventoId: string, invitado: Omit<Invitado, 'id'>) => Promise<void>;
  updateEstadoInvitado: (id: string, nuevoEstado: Invitado['estado']) => Promise<void>;
  assignMesa: (id: string, mesaId: string) => Promise<void>;
  addMesa: (eventoId: string, nombre: string) => Promise<void>;
  checkInInvitado: (eventoId: string, invitadoId: string) => Promise<Invitado>;
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
          await guestService.assignMesa(currentEventId, id, mesaId === 'none' ? undefined : mesaId);
          set((state) => ({
              invitados: state.invitados.map(inv =>
                  inv.id === id ? { ...inv, mesaId: mesaId === 'none' ? undefined : mesaId } : inv
              )
          }));
      } catch (error) {
          set({ error: 'No se pudo asignar mesa' });
      }
  },

  addMesa: async (eventoId, nombre) => {
      try {
          const nuevaMesa = await guestService.addMesa(eventoId, { nombre });
          set((state) => ({
              mesas: [...state.mesas, nuevaMesa]
          }));
      } catch (error) {
          set({ error: 'Error al agregar mesa' });
      }
  },

  checkInInvitado: async (eventoId, invitadoId) => {
    try {
      // 1. Verificamos cache local rápida (por si escanean dos veces)
      const { invitados } = get();
      let targetGuest = invitados.find(inv => inv.id === invitadoId);

      // 2. Si no está en cache, hacemos la búsqueda quirúrgica en el servidor
      // Pedimos limit 1 para que el servidor no trabaje de más
      if (!targetGuest) {
        const response = await guestService.getInvitados(eventoId, 1, 1, invitadoId);
        if (response.data.length > 0) {
          targetGuest = response.data[0];
          // Guardamos en el store solo este invitado para tenerlo en memoria
          set((state) => ({ invitados: [...state.invitados, targetGuest!] }));
        }
      }

      if (!targetGuest) {
        throw new Error('Invitado no encontrado');
      }

      // 3. Simulación de confirmación local
      const updated = { ...targetGuest, asistio: true };
      set((state) => ({
        invitados: state.invitados.map(inv => 
          inv.id === invitadoId ? updated : inv
        )
      }));

      return updated;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  }
}));