import { create } from 'zustand';
import { eventService } from '@/services/event.service';

// Definimos los tipos de datos (esto luego lo puedes sacar de tus interfaces compartidas)
export interface Evento {
  id: string;
  nombre_agasajado: string;
  fecha: string;
  tipo: 'boda' | '15';
  estado: 'pendiente' | 'confirmado';
}

interface EventState {
  eventos: Evento[];
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchEventos: () => Promise<void>;
  addEvento: (nuevoEvento: Omit<Evento, 'id'>) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  eventos: [],
  isLoading: false,
  error: null,

  fetchEventos: async () => {
    set({ isLoading: true, error: null });
    try {
      // Usar el servicio real para obtener eventos
      // const data = await eventService.getAll();
      // set({ eventos: data, isLoading: false });
      
      // Simulamos la respuesta para el MVP:
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dataSimulada: Evento[] = [
        { id: '1', nombre_agasajado: 'Martina', fecha: '2026-10-15', tipo: '15', estado: 'confirmado' },
        { id: '2', nombre_agasajado: 'Clara y Marcos', fecha: '2026-11-20', tipo: 'boda', estado: 'pendiente' }
      ];
      set({ eventos: dataSimulada, isLoading: false });
    } catch (error) {
      set({ error: 'Error al cargar los eventos', isLoading: false });
    }
  },

  addEvento: async (nuevoEvento) => {
    set({ isLoading: true, error: null });
    try {
      // const eventoCreado = await eventService.create(nuevoEvento);
      
      // Simulamos la creación agregándolo al estado actual
      await new Promise(resolve => setTimeout(resolve, 500));
      const eventoCreado = { ...nuevoEvento, id: Math.random().toString() };
      set((state) => ({ 
        eventos: [...state.eventos, eventoCreado], 
        isLoading: false 
      }));
    } catch (error) {
      set({ error: 'Error al crear el evento', isLoading: false });
    }
  }
}));