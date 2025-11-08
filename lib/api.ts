import axios from 'axios';
import { Program, User, PaginatedResponse } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' }
});


export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Auth interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Programs API
export const programsApi = {
  list: (params?: { name?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Program>>('/programs', { params }),
  
  getById: (id: string) =>
    api.get<Program>(`/programs/${id}`),
  
  create: (data: Partial<Program>) =>
    api.post<Program>('/programs', data),
  
  update: (id: string, data: Partial<Program>) =>
    api.put<Program>(`/programs/${id}`, data),
  
  delete: (id: string) =>
    api.delete<void>(`/programs/${id}`)
};

// Users API
export const usersApi = {
  list: (params?: { programId?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<User>>('/users', { params }),
  
  create: (data: Partial<User>) =>
    api.post<User>('/users', data),
  
  login: (email: string, password: string) =>
    api.post<{access_token: string}>('/auth/login', { email, password })
};

export default api;