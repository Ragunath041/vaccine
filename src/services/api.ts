/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  authService,
  childrenService,
  vaccineService,
  appointmentService,
  vaccinationRecordService,
  doctorService
} from './localStorage';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
  role: 'parent' | 'doctor';
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'parent' | 'doctor';
  specialization?: string;
  licenseNumber?: string;
  hospitalName?: string;
  yearsOfExperience?: number;
}

// Auth endpoints
export const auth = {
  login: (credentials: LoginCredentials) => 
    authService.login(credentials.email, credentials.password, credentials.role)
      .then(response => ({ data: response })),
  register: (userData: RegistrationData) => 
    authService.register({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      role: userData.role,
      specialization: userData.specialization,
      licenseNumber: userData.licenseNumber,
      hospitalName: userData.hospitalName,
      yearsOfExperience: userData.yearsOfExperience
    }).then(response => ({ data: response })),
};

// User endpoints
export const users = {
  getProfile: () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return Promise.reject(new Error('User not found'));
    }
    const user = JSON.parse(userJson);
    return Promise.resolve({ data: user });
  },
  updateProfile: (data: Partial<RegistrationData>) => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return Promise.reject(new Error('User not found'));
    }
    
    const user = JSON.parse(userJson);
    const updatedUser = { ...user, ...data };
    
    // Update in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((u: any) => u.id === user.id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    return Promise.resolve({ data: updatedUser });
  },
};

// Children endpoints
export const children = {
  getAll: () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return Promise.reject(new Error('User not found'));
    }
    
    const user = JSON.parse(userJson);
    return childrenService.getAll(user.id)
      .then(response => ({ data: response }));
  },
  getOne: (id: string) => 
    childrenService.getOne(id)
      .then(response => ({ data: response })),
  create: (data: any) => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return Promise.reject(new Error('User not found'));
    }
    
    const user = JSON.parse(userJson);
    return childrenService.create({
      ...data,
      parent_id: user.id
    }).then(response => ({ data: response }));
  },
  update: (id: string, data: any) => 
    childrenService.update(id, data)
      .then(response => ({ data: response })),
  delete: (id: string) => 
    childrenService.delete(id)
      .then(() => ({ data: { success: true } })),
};

// Vaccine endpoints
export const vaccines = {
  getAll: () => 
    vaccineService.getAll()
      .then(response => ({ data: response })),
  getOne: (id: string) => 
    vaccineService.getOne(id)
      .then(response => ({ data: response })),
};

// Appointments endpoints
export const appointments = {
  getAll: () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return Promise.reject(new Error('User not found'));
    }
    
    const user = JSON.parse(userJson);
    if (user.role === 'parent') {
      return appointmentService.getAll(user.id)
        .then(response => ({ data: response }));
    } else if (user.role === 'doctor') {
      return appointmentService.getByDoctor(user.id)
        .then(response => ({ data: response }));
    }
    
    return Promise.reject(new Error('Invalid user role'));
  },
  getOne: (id: string) => 
    appointmentService.getOne(id)
      .then(response => ({ data: response })),
  create: (data: any) => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return Promise.reject(new Error('User not found'));
    }
    
    const user = JSON.parse(userJson);
    return appointmentService.create({
      ...data,
      parent_id: user.id,
      status: 'pending'
    }).then(response => ({ data: response }));
  },
  update: (id: string, data: Partial<any>) => 
    appointmentService.update(id, data)
      .then(response => ({ data: response })),
  delete: (id: string) => 
    appointmentService.delete(id)
      .then(() => ({ data: { success: true } })),
  accept: (id: string) =>
    appointmentService.accept(id)
      .then(response => ({ data: response })),
  reject: (id: string, reason: string) =>
    appointmentService.reject(id, reason)
      .then(response => ({ data: response })),
  complete: (id: string) =>
    appointmentService.complete(id)
      .then(response => ({ data: response })),
};

// Vaccination records endpoints
export const vaccinationRecords = {
  getAll: () => 
    vaccinationRecordService.getAll()
      .then(response => ({ data: response })),
  getByChild: (childId: string) => 
    vaccinationRecordService.getByChild(childId)
      .then(response => ({ data: response })),
  create: (data: any) => 
    vaccinationRecordService.create(data)
      .then(response => ({ data: response })),
  update: (id: string, data: any) => 
    vaccinationRecordService.update(id, data)
      .then(response => ({ data: response })),
  delete: (id: string) => 
    vaccinationRecordService.delete(id)
      .then(() => ({ data: { success: true } })),
};

// Doctor endpoints
export const doctors = {
  getAll: () => 
    doctorService.getAll()
      .then(response => ({ data: response })),
  getOne: (id: string) => 
    doctorService.getOne(id)
      .then(response => ({ data: response })),
};

// Export all services
export default {
  auth,
  users,
  children,
  vaccines,
  appointments,
  vaccinationRecords,
  doctors
}; 