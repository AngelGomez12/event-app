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
  
  fetchInvitados: (eventoId: string) => Promise<void>;
  addInvitado: (invitado: Omit<Invitado, 'id'>) => Promise<void>;
  updateEstadoInvitado: (id: string, nuevoEstado: Invitado['estado']) => Promise<void>;
  assignMesa: (id: string, mesaId: string) => Promise<void>;
  addMesa: (nombre: string) => void;
}

export const useGuestStore = create<GuestState>((set) => ({
  invitados: [],
  mesas: [
      { id: '1', nombre: 'Mesa Principal' },
      { id: '2', nombre: 'Familia Novia' }
  ],
  isLoading: false,
  error: null,

  fetchInvitados: async (eventoId) => {
    set({ isLoading: true, error: null });
    try {
      // Usar servicio real:
      // const data = await guestService.getInvitados(eventoId);
      // set({ invitados: data, isLoading: false });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Fake data
      const fakeGuests: Invitado[] = [
        { id: '1', nombre: 'Juan Perez', telefono: '12345678', estado: 'confirmado', restriccionAlimentaria: 'Sin gluten' },
        { id: '2', nombre: 'Maria Gomez', telefono: '87654321', estado: 'pendiente' }
      ];
      set({ invitados: fakeGuests, isLoading: false }); 
    } catch (error) {
      set({ error: 'Error al cargar invitados', isLoading: false });
    }
  },

  addInvitado: async (invitado) => {
      set({ isLoading: true, error: null });
      try {
          // const nuevoInvitado = await guestService.addInvitado(invitado);
          await new Promise(resolve => setTimeout(resolve, 500));
          const nuevoInvitado = { ...invitado, id: Math.random().toString() };
          set((state) => ({
              invitados: [...state.invitados, nuevoInvitado],
              isLoading: false
          }));
      } catch (error) {
          set({ error: 'Error al agregar invitado', isLoading: false });
      }
  },

  updateEstadoInvitado: async (id, nuevoEstado) => {
    try {
      // Usar servicio real:
      // await guestService.updateEstado(id, nuevoEstado);
      
      // Actualización optimista en el estado local:
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
      try {
          // Usar servicio real:
          // await guestService.assignMesa(id, mesaId === 'none' ? undefined : mesaId);
          set((state) => ({
              invitados: state.invitados.map(inv =>
                  inv.id === id ? { ...inv, mesaId: mesaId === 'none' ? undefined : mesaId } : inv
              )
          }));
      } catch (error) {
          set({ error: 'No se pudo asignar mesa' });
      }
  },

  addMesa: (nombre: string) => {
      // Opcional: const nuevaMesa = await guestService.addMesa({ nombre });
      set((state) => ({
          mesas: [...state.mesas, { id: Math.random().toString(), nombre }]
      }));
  }
}));