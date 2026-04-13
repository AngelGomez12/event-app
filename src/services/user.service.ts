import apiClient from './apiClient';
import { User, CreateUserDto } from '@/lib/api';

export const userService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/users');
      return response.data.data || [];
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al obtener los usuarios');
    }
  },

  create: async (data: CreateUserDto): Promise<User> => {
    try {
      const response = await apiClient.post('/users', data);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al crear el usuario');
    }
  }
};
