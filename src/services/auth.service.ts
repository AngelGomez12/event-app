import apiClient from './apiClient';
import { AuthResponse, Role } from '@/lib/api';
import Cookies from 'js-cookie';

export const authService = {
  login: async (email: string, password: string): Promise<any> => {
    try {
      const response = await apiClient.post<any>('/auth/login', { email, password });
      
      const { accessToken, user } = response.data.data;
      
      // Guardar en cookies para acceso cliente o SSR ligero
      Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'lax' });
      Cookies.set('userRole', user.role, { expires: 7, sameSite: 'lax' });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  impersonate: async (tenantId: string): Promise<void> => {
    try {
      // Guardamos el token actual (el de Super Admin) para poder volver
      const currentToken = Cookies.get('accessToken');
      if (currentToken) {
        Cookies.set('impersonatorToken', currentToken, { expires: 1, sameSite: 'lax' });
      }

      const response = await apiClient.post<any>('/auth/impersonate', { tenantId });
      const { accessToken, user } = response.data.data;

      // Cambiamos al token del salón
      Cookies.set('accessToken', accessToken, { expires: 1, sameSite: 'lax' });
      Cookies.set('userRole', user.role, { expires: 1, sameSite: 'lax' });
      
      // Redirigimos al dashboard del salón
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Error al impersonar', error);
      throw new Error('No se pudo entrar como este salón');
    }
  },

  stopImpersonating: () => {
    const originalToken = Cookies.get('impersonatorToken');
    const originalRole = 'SUPER_ADMIN'; // Sabemos que viene de Super Admin

    if (originalToken) {
      Cookies.set('accessToken', originalToken, { expires: 7, sameSite: 'lax' });
      Cookies.set('userRole', originalRole, { expires: 7, sameSite: 'lax' });
      Cookies.remove('impersonatorToken');
      window.location.href = '/super-admin/dashboard';
    }
  },

  logout: () => {
    Cookies.remove('accessToken');
    Cookies.remove('userRole');
    Cookies.remove('impersonatorToken');
    window.location.href = '/login';
  }
};
