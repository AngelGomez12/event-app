import apiClient from './apiClient';
import { Invitado, Mesa } from '@/store/useGuestStore';

// Mapeo de estados entre Frontend (Español) y Backend (Inglés)
const statusMap = {
  toBack: {
    'pendiente': 'PENDING',
    'confirmado': 'CONFIRMED',
    'rechazado': 'DECLINED'
  },
  toFront: {
    'PENDING': 'pendiente',
    'CONFIRMED': 'confirmado',
    'DECLINED': 'rechazado'
  }
};

export const guestService = {
  getInvitados: async (eventoId: string, search?: string): Promise<Invitado[]> => {
    try {
      const url = search 
        ? `/events/${eventoId}/guests?search=${encodeURIComponent(search)}`
        : `/events/${eventoId}/guests`;
      const response = await apiClient.get(url);
      
      // Manejar la estructura de respuesta del backend y mapear a modelo frontend
      const rawData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      
      return rawData.map((g: any) => ({
        id: g.id,
        nombre: g.fullName || 'Sin nombre',
        telefono: g.phone || '',
        restriccionAlimentaria: g.dietaryRestrictions || '',
        estado: statusMap.toFront[g.attendanceStatus as keyof typeof statusMap.toFront] || 'pendiente',
        mesaId: g.tableId || undefined
      }));
    } catch (error: any) {
      console.error('Error in getInvitados:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los invitados');
    }
  },

  addInvitado: async (eventoId: string, invitado: Omit<Invitado, 'id'>): Promise<Invitado> => {
    try {
      const payload = {
        fullName: invitado.nombre,
        attendanceStatus: statusMap.toBack[invitado.estado as keyof typeof statusMap.toBack],
        // Estos campos no están aún en el DTO del backend pero los enviamos por si acaso
        phone: invitado.telefono,
        dietaryRestrictions: invitado.restriccionAlimentaria
      };
      
      const response = await apiClient.post(`/events/${eventoId}/guests`, payload);
      const g = response.data;
      
      return {
        id: g.id || Math.random().toString(36).substr(2, 9), // Fallback si el backend es placeholder
        nombre: g.fullName || invitado.nombre,
        telefono: g.phone || invitado.telefono,
        restriccionAlimentaria: g.dietaryRestrictions || invitado.restriccionAlimentaria,
        estado: statusMap.toFront[g.attendanceStatus as keyof typeof statusMap.toFront] || invitado.estado,
        mesaId: g.tableId || undefined
      };
    } catch (error: any) {
      console.error('Error in addInvitado:', error);
      throw new Error(error.response?.data?.message || 'Error al agregar el invitado');
    }
  },

  updateEstado: async (eventoId: string, id: string, nuevoEstado: Invitado['estado']): Promise<void> => {
    try {
      const payload = { 
        attendanceStatus: statusMap.toBack[nuevoEstado as keyof typeof statusMap.toBack] 
      };
      await apiClient.patch(`/events/${eventoId}/guests/${id}`, payload);
    } catch (error: any) {
      console.error('Error in updateEstado:', error);
      throw new Error(error.response?.data?.message || 'No se pudo actualizar el estado');
    }
  },

  assignMesa: async (eventoId: string, id: string, mesaId: string | undefined): Promise<void> => {
    try {
      await apiClient.patch(`/events/${eventoId}/guests/${id}`, { tableId: mesaId });
    } catch (error: any) {
      console.error('Error in assignMesa:', error);
      throw new Error(error.response?.data?.message || 'No se pudo asignar la mesa');
    }
  },

  getMesas: async (eventoId: string): Promise<Mesa[]> => {
    try {
      // Nota: El endpoint /tables aún no existe en el backend real
      const response = await apiClient.get(`/events/${eventoId}/tables`);
      const data = response.data;
      const rawData = Array.isArray(data) ? data : (data.data || []);
      
      return rawData.map((m: any) => ({
        id: m.id,
        nombre: m.name || m.nombre
      }));
    } catch (error: any) {
      console.error('Error in getMesas:', error);
      // Retornamos array vacío si falla (probablemente 404 porque no existe el endpoint)
      return [];
    }
  },

  addMesa: async (eventoId: string, mesa: Omit<Mesa, 'id'>): Promise<Mesa> => {
    try {
      const response = await apiClient.post(`/events/${eventoId}/tables`, { name: mesa.nombre });
      return {
        id: response.data.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
        nombre: response.data.name || response.data.nombre || mesa.nombre
      };
    } catch (error: any) {
      console.error('Error in addMesa:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la mesa');
    }
  }
};
