import { create } from 'zustand';
import { guestService } from '@/services/guest.service';
import { FloorPlanElement, Mesa } from './useGuestStore';

interface FloorPlanState {
  elements: FloorPlanElement[];
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
  
  fetchElements: (eventoId: string) => Promise<void>;
  setElements: (elements: FloorPlanElement[]) => void;
  addElement: (eventoId: string, element: Omit<FloorPlanElement, 'id'>) => Promise<void>;
  updateElement: (eventoId: string, id: string, element: Partial<FloorPlanElement>) => Promise<void>;
  removeElement: (eventoId: string, id: string) => Promise<void>;
  saveTablePositions: (eventoId: string, mesas: Mesa[]) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
}

export const useFloorPlanStore = create<FloorPlanState>((set, get) => ({
  elements: [],
  isEditing: false,
  isLoading: false,
  error: null,

  fetchElements: async (eventoId) => {
    set({ isLoading: true, error: null });
    try {
      const elements = await guestService.getFloorPlanElements(eventoId);
      set({ elements, isLoading: false });
    } catch (error) {
      set({ error: 'Error al cargar elementos del plano', isLoading: false });
    }
  },

  setElements: (elements) => set({ elements }),

  addElement: async (eventoId, element) => {
    set({ isLoading: true, error: null });
    try {
      const newElement = await guestService.createFloorPlanElement(eventoId, element);
      set((state) => ({
        elements: [...state.elements, newElement],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Error al agregar elemento', isLoading: false });
    }
  },

  updateElement: async (eventoId, id, element) => {
    try {
      const updated = await guestService.updateFloorPlanElement(eventoId, id, element);
      set((state) => ({
        elements: state.elements.map(el => el.id === id ? updated : el)
      }));
    } catch (error) {
      set({ error: 'Error al actualizar elemento' });
    }
  },

  removeElement: async (eventoId, id) => {
    try {
      await guestService.deleteFloorPlanElement(eventoId, id);
      set((state) => ({
        elements: state.elements.filter(el => el.id !== id)
      }));
    } catch (error) {
      set({ error: 'Error al eliminar elemento' });
    }
  },

  saveTablePositions: async (eventoId, mesas) => {
    set({ isLoading: true, error: null });
    try {
      const positions = mesas.map(m => ({
        id: m.id,
        x: m.x,
        y: m.y,
        rotation: m.rotation,
        isStructural: m.isStructural
      }));
      await guestService.updateTablePositions(eventoId, positions);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Error al guardar posiciones de mesas', isLoading: false });
    }
  },

  setIsEditing: (isEditing) => set({ isEditing }),
}));
