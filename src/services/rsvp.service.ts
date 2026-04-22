import axios from "axios";

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RsvpDetails {
  id: string;
  fullName?: string;
  guestName?: string; // fallback
  name?: string; // fallback
  attendanceStatus?: string;
  status?: string; // fallback
  estado?: string; // fallback
  phone?: string;
  dietaryRestrictions?: string;
  event?: {
    id: string;
    name?: string;
    guestName?: string;
    title?: string;
    imageUrl?: string;
  };
}

export const rsvpService = {
  getInvitation: async (token: string): Promise<RsvpDetails> => {
    try {
      const response = await publicApi.get(`/rsvp/${token}`);
      // El backend podría devolver los datos directo en response.data,
      // o wrappeados en response.data.data
      const data = response.data.data || response.data;
      return data;
    } catch (error: any) {
      console.error("Error fetching invitation:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener la invitación",
      );
    }
  },

  confirmAttendance: async (
    token: string,
    status: "CONFIRMED" | "DECLINED",
  ): Promise<void> => {
    try {
      // Mandamos tanto attendanceStatus como status por si el backend usa otro nombre
      await publicApi.post(`/rsvp/${token}/confirm`, {
        attendanceStatus: status,
      });
    } catch (error: any) {
      console.error("Error confirming attendance:", error);
      throw new Error(
        error.response?.data?.message || "Error al confirmar la asistencia",
      );
    }
  },
};
