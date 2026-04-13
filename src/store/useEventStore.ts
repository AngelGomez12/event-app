import { create } from 'zustand';
import { eventService } from '@/services/event.service';
import { Event, CreateEventDto, EventStatus } from '@/lib/api';

interface EventState {
  eventos: Event[];
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchEventos: () => Promise<void>;
  addEvento: (nuevoEvento: CreateEventDto) => Promise<void>;
  updateEstadoEvento: (id: string, status: EventStatus) => Promise<void>;
  fetchEventoById: (id: string) => Promise<Event>;
  updateEventPrice: (id: string, basePrice: number) => Promise<void>;
  addEventPayment: (id: string, paymentData: any) => Promise<void>;
  removeEventPayment: (eventId: string, paymentId: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  eventos: [],
  isLoading: false,
  error: null,

  fetchEventos: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await eventService.getAll();
      set({ eventos: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar los eventos', isLoading: false });
    }
  },

  addEvento: async (nuevoEvento) => {
    set({ isLoading: true, error: null });
    try {
      const eventoCreado = await eventService.create(nuevoEvento);
      set((state) => ({ 
        eventos: [...state.eventos, eventoCreado], 
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message || 'Error al crear el evento', isLoading: false });
      throw error;
    }
  },

  updateEstadoEvento: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const eventoActualizado = await eventService.updateStatus(id, status);
      set((state) => ({
        eventos: state.eventos.map((e) => (e.id === id ? eventoActualizado : e)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Error al actualizar el estado del evento', isLoading: false });
      throw error;
    }
    },

    fetchEventoById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const event = await eventService.getById(id);
      set({ isLoading: false });
      return event;
    } catch (error: any) {
      set({ error: error.message || 'Error al obtener evento', isLoading: false });
      throw error;
    }
    },

    updateEventPrice: async (id: string, basePrice: number) => {
    set({ isLoading: true, error: null });
    try {
      await eventService.updatePrice(id, basePrice);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al actualizar precio', isLoading: false });
      throw error;
    }
    },

    addEventPayment: async (id: string, paymentData: any) => {
    set({ isLoading: true, error: null });
    try {
      await eventService.addPayment(id, paymentData);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al registrar pago', isLoading: false });
      throw error;
    }
    },

    removeEventPayment: async (eventId: string, paymentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await eventService.removePayment(eventId, paymentId);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al eliminar pago', isLoading: false });
      throw error;
    }
    }
    }));