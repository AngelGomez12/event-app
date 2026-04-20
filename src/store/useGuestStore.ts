import { create } from 'zustand';
import { guestService } from '@/services/guest.service';

export interface Invitado {
  id: string;
  nombre: string;
  telefono?: string;
  restriccionAlimentaria?: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  mesaId?: string;
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
  
  fetchInvitados: (eventoId: string, search?: string) => Promise<void>;
  fetchMesas: (eventoId: string) => Promise<void>;
  addInvitado: (eventoId: string, invitado: Omit<Invitado, 'id'>) => Promise<void>;
  updateEstadoInvitado: (id: string, nuevoEstado: Invitado['estado']) => Promise<void>;
  assignMesa: (id: string, mesaId: string) => Promise<void>;
  addMesa: (eventoId: string, nombre: string) => Promise<void>;
}

export const useGuestStore = create<GuestState>((set, get) => ({
  invitados: [],
  mesas: [],
  isLoading: false,
  error: null,
  currentEventId: null,

  fetchInvitados: async (eventoId, search) => {
    set({ isLoading: true, error: null, currentEventId: eventoId });
    try {
      const data = await guestService.getInvitados(eventoId, search);
      set({ invitados: data, isLoading: false });
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
  }
}));