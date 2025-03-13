/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'patient' | 'doctor';
  specialization?: string;
  licenseNumber?: string;
  hospitalName?: string;
  yearsOfExperience?: number;
}

// Auth endpoints
export const auth = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  register: (userData: RegistrationData) => 
    api.post('/auth/register', userData),
};

// User endpoints
export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: Partial<RegistrationData>) => api.put('/users/profile', data),
};

// Children endpoints
export const children = {
  getAll: () => api.get('/children'),
  getOne: (id: string) => api.get(`/children/${id}`),
  create: (data: any) => api.post('/children', data),
  update: (id: string, data: any) => api.put(`/children/${id}`, data),
  delete: (id: string) => api.delete(`/children/${id}`),
};

// Vaccine endpoints
export const vaccines = {
  getAll: () => api.get('/vaccines'),
  getOne: (id: string) => api.get(`/vaccines/${id}`),
};

// Appointments endpoints
export const appointments = {
  getAll: () => api.get('/appointments'),
  getOne: (id: string) => api.get(`/appointments/${id}`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (data: any) => api.post('/appointments', data),
  update: (id: string, data: Partial<any>) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
};

export default api; 