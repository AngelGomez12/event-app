import apiClient from "./apiClient";
import { Invitado, Mesa } from "@/store/useGuestStore";
import { PaginatedResponse } from "@/lib/api";

// Mapeo de estados entre Frontend (Español) y Backend (Inglés)
const statusMap = {
  toBack: {
    pendiente: "PENDING",
    confirmado: "CONFIRMED",
    rechazado: "DECLINED",
  },
  toFront: {
    PENDING: "pendiente",
    CONFIRMED: "confirmado",
    DECLINED: "rechazado",
  },
};

export const guestService = {
  getInvitados: async (
    eventoId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<PaginatedResponse<Invitado>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);

      const url = `/events/${eventoId}/guests?${params.toString()}`;
      const response = await apiClient.get(url);

      const { data, meta } = response.data;

      const mappedData = data.map((g: any) => ({
        id: g.id,
        nombre: g.fullName || "Sin nombre",
        email: g.email || "",
        telefono: g.phone || "",
        restriccionAlimentaria: g.dietaryRestrictions || "",
        estado:
          statusMap.toFront[
            g.attendanceStatus as keyof typeof statusMap.toFront
          ] || "pendiente",
        mesaId: g.tableId || undefined,
      }));

      return {
        data: mappedData,
        meta,
      };
    } catch (error: any) {
      console.error("Error in getInvitados:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener los invitados",
      );
    }
  },

  addInvitado: async (
    eventoId: string,
    invitado: Omit<Invitado, "id">,
  ): Promise<Invitado> => {
    try {
      const payload: any = {
        fullName: invitado.nombre,
        attendanceStatus:
          statusMap.toBack[invitado.estado as keyof typeof statusMap.toBack],
      };

      // Solo enviamos los campos opcionales si tienen valor para evitar errores de validación (400)
      if (invitado.email) payload.email = invitado.email;
      if (invitado.telefono) payload.phone = invitado.telefono;
      if (invitado.restriccionAlimentaria) payload.dietaryRestrictions = invitado.restriccionAlimentaria;

      const response = await apiClient.post(
        `/events/${eventoId}/guests`,
        payload,
      );
      const g = response.data;

      return {
        id: g.id || Math.random().toString(36).substr(2, 9),
        nombre: g.fullName || invitado.nombre,
        email: g.email || invitado.email,
        telefono: g.phone || invitado.telefono,
        restriccionAlimentaria:
          g.dietaryRestrictions || invitado.restriccionAlimentaria,
        estado:
          statusMap.toFront[
            g.attendanceStatus as keyof typeof statusMap.toFront
          ] || invitado.estado,
        mesaId: g.tableId || undefined,
      };
    } catch (error: any) {
      console.error("Error in addInvitado:", error);
      throw new Error(
        error.response?.data?.message || "Error al agregar el invitado",
      );
    }
  },

  updateEstado: async (
    eventoId: string,
    id: string,
    nuevoEstado: Invitado["estado"],
  ): Promise<void> => {
    try {
      const payload = {
        attendanceStatus:
          statusMap.toBack[nuevoEstado as keyof typeof statusMap.toBack],
      };
      await apiClient.patch(`/events/${eventoId}/guests/${id}`, payload);
    } catch (error: any) {
      console.error("Error in updateEstado:", error);
      throw new Error(
        error.response?.data?.message || "No se pudo actualizar el estado",
      );
    }
  },

  assignMesa: async (
    eventoId: string,
    id: string,
    mesaId: string | undefined,
  ): Promise<void> => {
    try {
      await apiClient.patch(`/events/${eventoId}/guests/${id}`, {
        tableId: mesaId,
      });
    } catch (error: any) {
      console.error("Error in assignMesa:", error);
      throw new Error(
        error.response?.data?.message || "No se pudo asignar la mesa",
      );
    }
  },

  checkIn: async (eventoId: string, invitadoId: string): Promise<Invitado> => {
    try {
      // Por ahora usamos GET para obtener la info del invitado (incluyendo mesa)
      // ya que el campo 'attendanceConfirmed' no existe en el backend actual.
      const response = await apiClient.get(`/events/${eventoId}/guests/${invitadoId}`);
      const g = response.data;
      
      return {
        id: g.id,
        nombre: g.fullName || "Sin nombre",
        email: g.email || "",
        telefono: g.phone || "",
        restriccionAlimentaria: g.dietaryRestrictions || "",
        estado: "confirmado",
        asistio: true, // Lo marcamos localmente para la UI
        mesaId: g.tableId || undefined,
      };
    } catch (error: any) {
      console.error("Error in checkIn:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener información del invitado",
      );
    }
  },

  getMesas: async (eventoId: string): Promise<Mesa[]> => {
    try {
      // Nota: El endpoint /tables aún no existe en el backend real
      const response = await apiClient.get(`/events/${eventoId}/tables`);
      const data = response.data;
      const rawData = Array.isArray(data) ? data : data.data || [];

      return rawData.map((m: any) => ({
        id: m.id,
        nombre: m.name || m.nombre,
      }));
    } catch (error: any) {
      console.error("Error in getMesas:", error);
      // Retornamos array vacío si falla (probablemente 404 porque no existe el endpoint)
      return [];
    }
  },

  addMesa: async (eventoId: string, mesa: Omit<Mesa, "id">): Promise<Mesa> => {
    try {
      const response = await apiClient.post(`/events/${eventoId}/tables`, {
        name: mesa.nombre,
      });
      return {
        id:
          response.data.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
        nombre: response.data.name || response.data.nombre || mesa.nombre,
      };
    } catch (error: any) {
      console.error("Error in addMesa:", error);
      throw new Error(
        error.response?.data?.message || "Error al crear la mesa",
      );
    }
  },
};
