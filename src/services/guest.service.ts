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

const dietaryMap = {
  toBack: {
    "ninguna": "NONE",
    "vegetariano": "VEGETARIAN",
    "vegano": "VEGAN",
    "celiaco": "CELIAC",
    "otro": "OTHER",
  },
  toFront: {
    NONE: "ninguna",
    VEGETARIAN: "vegetariano",
    VEGAN: "vegano",
    CELIAC: "celiaco",
    OTHER: "otro",
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
        restriccionAlimentaria:
          dietaryMap.toFront[
            g.dietaryRestrictions as keyof typeof dietaryMap.toFront
          ] || "ninguna",
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
        dietaryRestrictions:
          dietaryMap.toBack[
            invitado.restriccionAlimentaria as keyof typeof dietaryMap.toBack
          ] || "NONE",
      };

      if (invitado.email) payload.email = invitado.email;
      if (invitado.telefono) payload.phone = invitado.telefono;

      const response = await apiClient.post(
        `/events/${eventoId}/guests`,
        payload,
      );
      const g = response.data.data || response.data;

      return {
        id: g.id,
        nombre: g.fullName || invitado.nombre,
        email: g.email || invitado.email,
        telefono: g.phone || invitado.telefono,
        restriccionAlimentaria:
          dietaryMap.toFront[
            g.dietaryRestrictions as keyof typeof dietaryMap.toFront
          ] || invitado.restriccionAlimentaria,
        estado: (statusMap.toFront[
          g.attendanceStatus as keyof typeof statusMap.toFront
        ] || "pendiente") as Invitado["estado"],
        mesaId: g.tableId || undefined,
      };
    } catch (error: any) {
      console.error("Error in addInvitado:", error);
      throw new Error(
        error.response?.data?.message || "Error al agregar el invitado",
      );
    }
  },

  updateInvitado: async (
    eventoId: string,
    id: string,
    invitado: Partial<Invitado>,
  ): Promise<Invitado> => {
    try {
      const payload: any = {};
      if (invitado.nombre) payload.fullName = invitado.nombre;
      if (invitado.email !== undefined) payload.email = invitado.email;
      if (invitado.telefono !== undefined) payload.phone = invitado.telefono;
      if (invitado.estado)
        payload.attendanceStatus =
          statusMap.toBack[invitado.estado as keyof typeof statusMap.toBack];
      if (invitado.restriccionAlimentaria)
        payload.dietaryRestrictions =
          dietaryMap.toBack[
            invitado.restriccionAlimentaria as keyof typeof dietaryMap.toBack
          ];

      const response = await apiClient.patch(
        `/events/${eventoId}/guests/${id}`,
        payload,
      );
      const g = response.data.data || response.data;

      return {
        id: g.id,
        nombre: g.fullName,
        email: g.email,
        telefono: g.phone,
        restriccionAlimentaria:
          dietaryMap.toFront[
            g.dietaryRestrictions as keyof typeof dietaryMap.toFront
          ],
        estado: statusMap.toFront[
          g.attendanceStatus as keyof typeof statusMap.toFront
        ] as Invitado["estado"],
        mesaId: g.tableId,
      };
    } catch (error: any) {
      console.error("Error in updateInvitado:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar el invitado",
      );
    }
  },

  removeInvitado: async (eventoId: string, id: string): Promise<void> => {
    try {
      await apiClient.delete(`/events/${eventoId}/guests/${id}`);
    } catch (error: any) {
      console.error("Error in removeInvitado:", error);
      throw new Error(
        error.response?.data?.message || "Error al eliminar el invitado",
      );
    }
  },

  getPublicInvitation: async (guestId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/public/guests/${guestId}/invitation`);
      return response.data; // Aquí el backend devuelve el objeto directo
    } catch (error: any) {
      console.error("Error in getPublicInvitation:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener la invitación",
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
    mesaId: string | null | undefined,
  ): Promise<void> => {
    try {
      await apiClient.patch(`/events/${eventoId}/guests/${id}`, {
        tableId: mesaId,
      });
    } catch (error: any) {
      console.error("Error in assignMesa:", error);
      throw error;
    }
  },

  checkIn: async (eventoId: string, invitadoId: string): Promise<Invitado> => {
    try {
      // Por ahora usamos GET para obtener la info del invitado (incluyendo mesa)
      // ya que el campo 'attendanceConfirmed' no existe en el backend actual.
      const response = await apiClient.get(
        `/events/${eventoId}/guests/${invitadoId}`,
      );
      const g = response.data.data || response.data;

      return {
        id: g.id,
        nombre: g.fullName || "Sin nombre",
        email: g.email || "",
        telefono: g.phone || "",
        restriccionAlimentaria:
          dietaryMap.toFront[
            g.dietaryRestrictions as keyof typeof dietaryMap.toFront
          ] || "ninguna",
        estado: (statusMap.toFront[
          g.attendanceStatus as keyof typeof statusMap.toFront
        ] || "pendiente") as Invitado["estado"],
        asistio: true, // Lo marcamos localmente para la UI
        mesaId: g.tableId || undefined,
      };
    } catch (error: any) {
      console.error("Error in checkIn:", error);
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener información del invitado",
      );
    }
  },

  getMesas: async (eventoId: string): Promise<Mesa[]> => {
    try {
      const response = await apiClient.get(`/events/${eventoId}/tables`);
      const data = response.data;
      const rawData = Array.isArray(data) ? data : data.data || [];

      return rawData.map((m: any) => ({
        id: m.id,
        nombre: m.name || m.nombre,
        x: m.x || 0,
        y: m.y || 0,
        rotation: m.rotation || 0,
        type: m.type || "round",
        seats: m.seats || 8,
        color: m.color || "#ffffff",
        scale: m.scale || 1.0,
        isStructural: m.isStructural || false,
      }));
    } catch (error: any) {
      console.error("Error in getMesas:", error);
      return [];
    }
  },

  updateTablePositions: async (
    eventoId: string,
    positions: { id: string; x: number; y: number; rotation: number; isStructural?: boolean }[],
  ): Promise<void> => {
    try {
      await apiClient.patch(`/events/${eventoId}/tables/positions`, { positions });
    } catch (error: any) {
      console.error("Error in updateTablePositions:", error);
      throw new Error(error.response?.data?.message || "Error al actualizar las posiciones");
    }
  },

  getFloorPlanElements: async (eventoId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/events/${eventoId}/floor-plan-elements`);
      return response.data.data || response.data || [];
    } catch (error: any) {
      console.error("Error in getFloorPlanElements:", error);
      return [];
    }
  },

  createFloorPlanElement: async (eventoId: string, element: any): Promise<any> => {
    try {
      const response = await apiClient.post(`/events/${eventoId}/floor-plan-elements`, element);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error("Error in createFloorPlanElement:", error);
      throw new Error(error.response?.data?.message || "Error al crear el elemento");
    }
  },

  updateFloorPlanElement: async (eventoId: string, id: string, element: any): Promise<any> => {
    try {
      const response = await apiClient.patch(`/events/${eventoId}/floor-plan-elements/${id}`, element);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error("Error in updateFloorPlanElement:", error);
      throw new Error(error.response?.data?.message || "Error al actualizar el elemento");
    }
  },

  deleteFloorPlanElement: async (eventoId: string, id: string): Promise<void> => {
    try {
      await apiClient.delete(`/events/${eventoId}/floor-plan-elements/${id}`);
    } catch (error: any) {
      console.error("Error in deleteFloorPlanElement:", error);
      throw new Error(error.response?.data?.message || "Error al eliminar el elemento");
    }
  },

  addMesa: async (eventoId: string, mesa: Partial<Mesa>): Promise<Mesa> => {
    try {
      const response = await apiClient.post(`/events/${eventoId}/tables`, {
        name: mesa.nombre,
        x: mesa.x,
        y: mesa.y,
        rotation: mesa.rotation,
        type: mesa.type,
        seats: mesa.seats,
        color: mesa.color,
        scale: mesa.scale,
        isStructural: mesa.isStructural,
      });
      const data = response.data.data || response.data;
      return {
        id: data.id,
        nombre: data.name || data.nombre || mesa.nombre,
        x: data.x || 0,
        y: data.y || 0,
        rotation: data.rotation || 0,
        type: data.type || "round",
        seats: data.seats || 8,
        color: data.color || "#ffffff",
        scale: data.scale || 1.0,
        isStructural: data.isStructural || false,
      };
    } catch (error: any) {
      console.error("Error in addMesa:", error);
      throw new Error(error.response?.data?.message || "Error al crear la mesa");
    }
  },

  updateMesa: async (eventoId: string, id: string, mesa: Partial<Mesa>): Promise<Mesa> => {
    try {
      const response = await apiClient.patch(`/events/${eventoId}/tables/${id}`, {
        name: mesa.nombre,
        seats: mesa.seats,
        color: mesa.color,
        type: mesa.type,
        rotation: mesa.rotation,
        scale: mesa.scale,
        isStructural: mesa.isStructural,
      });
      const data = response.data.data || response.data;
      return {
        id: data.id,
        nombre: data.name || data.nombre || mesa.nombre,
        x: data.x || 0,
        y: data.y || 0,
        rotation: data.rotation || 0,
        type: data.type || "round",
        seats: data.seats || 8,
        color: data.color || "#ffffff",
        scale: data.scale || 1.0,
        isStructural: data.isStructural || false,
      };
    } catch (error: any) {
      console.error("Error in updateMesa:", error);
      throw new Error(error.response?.data?.message || "Error al actualizar la mesa");
    }
  },

  sendTicket: async (eventoId: string, guestId: string): Promise<void> => {
    try {
      await apiClient.post(`/events/${eventoId}/guests/${guestId}/send-ticket`);
    } catch (error: any) {
      console.error("Error in sendTicket:", error);
      throw new Error(
        error.response?.data?.message || "Error al enviar el ticket",
      );
    }
  },
};
