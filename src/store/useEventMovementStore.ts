import { create } from 'zustand';
import { eventMovementService, Movement } from '@/services/event-movement.service';
import { PaginationMeta } from '@/lib/api';

interface EventMovementState {
  movements: Movement[];
  isLoading: boolean;
  error: string | null;
  // Pagination
  pagination: PaginationMeta;
  
  // Totales (Nota: Actualmente calculados sobre los datos cargados en el store)
  totalIncome: number;
  totalExpense: number;
  balance: number;

  fetchMovements: (eventId: string, page?: number, limit?: number, search?: string) => Promise<void>;
  addMovement: (eventId: string, movement: Omit<Movement, 'id' | 'eventId'>) => Promise<void>;
  deleteMovement: (eventId: string, movementId: string) => Promise<void>;
}

export const useEventMovementStore = create<EventMovementState>((set, get) => ({
  movements: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,

  fetchMovements: async (eventId, page, limit, search) => {
    const { pagination } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await eventMovementService.findAll(
        eventId, 
        page || pagination.page, 
        limit || pagination.limit,
        search
      );
      
      const data = response.data;
      const totalIncome = data.filter(m => m.type === 'INCOME').reduce((s, m) => s + Number(m.amount), 0);
      const totalExpense = data.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Number(m.amount), 0);
      
      set({ 
        movements: data, 
        pagination: response.meta,
        totalIncome, 
        totalExpense, 
        balance: totalIncome - totalExpense,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addMovement: async (eventId, movement) => {
    set({ isLoading: true, error: null });
    try {
      const newMovement = await eventMovementService.create(eventId, movement);
      const movements = [...get().movements, newMovement];
      
      const totalIncome = movements.filter(m => m.type === 'INCOME').reduce((s, m) => s + Number(m.amount), 0);
      const totalExpense = movements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Number(m.amount), 0);

      set({ 
        movements,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteMovement: async (eventId, movementId) => {
    set({ isLoading: true, error: null });
    try {
      await eventMovementService.remove(eventId, movementId);
      const movements = get().movements.filter(m => m.id !== movementId);
      
      const totalIncome = movements.filter(m => m.type === 'INCOME').reduce((s, m) => s + Number(m.amount), 0);
      const totalExpense = movements.filter(m => m.type === 'EXPENSE').reduce((s, m) => s + Number(m.amount), 0);

      set({ 
        movements,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
