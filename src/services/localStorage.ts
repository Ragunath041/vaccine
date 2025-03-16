// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'parent' | 'doctor';
  phoneNumber: string;
  specialization?: string;
  licenseNumber?: string;
  hospitalName?: string;
  yearsOfExperience?: number;
}

export interface Child {
  id: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string | null;
  allergies: string | null;
}

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  recommended_age: string;
  doses_required: number;
  side_effects: string;
  contraindications: string;
}

export interface Appointment {
  id: string;
  parent_id: string;
  child_id: string;
  doctor_id: string;
  date: string;
  time: string;
  reason: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  rejection_reason?: string | null;
}

export interface VaccinationRecord {
  id: string;
  child_id: string;
  vaccine_id: string;
  vaccine_name?: string;
  vaccination_date: string;
  doctor_id: string;
  doctor_first_name?: string;
  doctor_last_name?: string;
  notes: string | null;
  status: 'completed' | 'scheduled';
  appointment_id?: string;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialization: string;
}

// Initialize localStorage with default data if empty
const initializeLocalStorage = () => {
  // Default vaccines
  if (!localStorage.getItem('vaccines')) {
    const defaultVaccines: Vaccine[] = [
      {
        id: '1',
        name: 'Hepatitis B',
        description: 'Protects against hepatitis B virus infection',
        recommended_age: 'Birth',
        doses_required: 3,
        side_effects: 'Soreness at injection site, mild fever',
        contraindications: 'Severe allergic reaction to previous dose'
      },
      {
        id: '2',
        name: 'DTaP',
        description: 'Protects against diphtheria, tetanus, and pertussis',
        recommended_age: '2 months',
        doses_required: 5,
        side_effects: 'Soreness at injection site, mild fever, fussiness',
        contraindications: 'Severe allergic reaction to previous dose'
      },
      {
        id: '3',
        name: 'Polio (IPV)',
        description: 'Protects against poliomyelitis',
        recommended_age: '2 months',
        doses_required: 4,
        side_effects: 'Soreness at injection site',
        contraindications: 'Severe allergic reaction to previous dose or neomycin'
      },
      {
        id: '4',
        name: 'MMR',
        description: 'Protects against measles, mumps, and rubella',
        recommended_age: '12-15 months',
        doses_required: 2,
        side_effects: 'Fever, mild rash, temporary joint pain',
        contraindications: 'Pregnancy, immunodeficiency'
      },
      {
        id: '5',
        name: 'Varicella',
        description: 'Protects against chickenpox',
        recommended_age: '12-15 months',
        doses_required: 2,
        side_effects: 'Soreness at injection site, mild fever, mild rash',
        contraindications: 'Pregnancy, immunodeficiency'
      }
    ];
    localStorage.setItem('vaccines', JSON.stringify(defaultVaccines));
  }

  // Default doctors
  if (!localStorage.getItem('doctors')) {
    const defaultDoctors: Doctor[] = [
      { id: '1', first_name: 'Arun', last_name: 'Patel', specialization: 'Pediatrician' },
      { id: '2', first_name: 'Priya', last_name: 'Sharma', specialization: 'Vaccination Specialist' },
      { id: '3', first_name: 'Rajesh', last_name: 'Kumar', specialization: 'Child Specialist' },
      { id: '4', first_name: 'Deepa', last_name: 'Gupta', specialization: 'Pediatrician' },
      { id: '5', first_name: 'Suresh', last_name: 'Verma', specialization: 'Immunologist' },
      { id: '6', first_name: 'Anita', last_name: 'Singh', specialization: 'Pediatrician' },
      { id: '7', first_name: 'Vikram', last_name: 'Malhotra', specialization: 'Child Specialist' }
    ];
    localStorage.setItem('doctors', JSON.stringify(defaultDoctors));
  }

  // Default doctor users - only initialize if users array doesn't exist
  if (!localStorage.getItem('users')) {
    const defaultDoctorUsers: User[] = [
      {
        id: '1',
        email: 'arun.patel@example.com',
        firstName: 'Arun',
        lastName: 'Patel',
        role: 'doctor',
        phoneNumber: '9876543210',
        specialization: 'Pediatrician',
        licenseNumber: 'MED12345',
        hospitalName: 'City Hospital',
        yearsOfExperience: 10
      },
      {
        id: '2',
        email: 'priya.sharma@example.com',
        firstName: 'Priya',
        lastName: 'Sharma',
        role: 'doctor',
        phoneNumber: '9876543211',
        specialization: 'Vaccination Specialist',
        licenseNumber: 'MED12346',
        hospitalName: 'City Hospital',
        yearsOfExperience: 8
      },
      {
        id: '3',
        email: 'rajesh.kumar@example.com',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        role: 'doctor',
        phoneNumber: '9876543212',
        specialization: 'Child Specialist',
        licenseNumber: 'MED12347',
        hospitalName: 'City Hospital',
        yearsOfExperience: 12
      },
      {
        id: '4',
        email: 'deepa.gupta@example.com',
        firstName: 'Deepa',
        lastName: 'Gupta',
        role: 'doctor',
        phoneNumber: '9876543213',
        specialization: 'Pediatrician',
        licenseNumber: 'MED12348',
        hospitalName: 'City Hospital',
        yearsOfExperience: 7
      },
      {
        id: '5',
        email: 'suresh.verma@example.com',
        firstName: 'Suresh',
        lastName: 'Verma',
        role: 'doctor',
        phoneNumber: '9876543214',
        specialization: 'Immunologist',
        licenseNumber: 'MED12349',
        hospitalName: 'City Hospital',
        yearsOfExperience: 15
      },
      {
        id: '6',
        email: 'anita.singh@example.com',
        firstName: 'Anita',
        lastName: 'Singh',
        role: 'doctor',
        phoneNumber: '9876543215',
        specialization: 'Pediatrician',
        licenseNumber: 'MED12350',
        hospitalName: 'City Hospital',
        yearsOfExperience: 9
      },
      {
        id: '7',
        email: 'vikram.malhotra@example.com',
        firstName: 'Vikram',
        lastName: 'Malhotra',
        role: 'doctor',
        phoneNumber: '9876543216',
        specialization: 'Child Specialist',
        licenseNumber: 'MED12351',
        hospitalName: 'City Hospital',
        yearsOfExperience: 11
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultDoctorUsers));
  }

  // Initialize empty arrays for user data
  if (!localStorage.getItem('children')) {
    localStorage.setItem('children', JSON.stringify([]));
  }
  if (!localStorage.getItem('appointments')) {
    localStorage.setItem('appointments', JSON.stringify([]));
  }
  if (!localStorage.getItem('vaccination_records')) {
    localStorage.setItem('vaccination_records', JSON.stringify([]));
  }
};

// Helper functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Auth services
export const authService = {
  login: (email: string, password: string, role: 'parent' | 'doctor'): Promise<{ user: User, token: string }> => {
    return new Promise((resolve, reject) => {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.role === role);
      
      if (user) {
        // In a real app, we would check the password hash
        // For this demo, we'll just simulate a successful login
        const token = `mock-token-${generateId()}`;
        resolve({ user, token });
      } else {
        reject(new Error('Invalid email or password'));
      }
    });
  },
  
  register: (userData: Omit<User, 'id'>): Promise<{ user: User, token: string }> => {
    return new Promise((resolve, reject) => {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.some(u => u.email === userData.email)) {
        reject(new Error('User with this email already exists'));
        return;
      }
      
      // Create new user
      const newUser: User = {
        ...userData,
        id: generateId()
      };
      
      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Generate token
      const token = `mock-token-${generateId()}`;
      
      resolve({ user: newUser, token });
    });
  }
};

// Children services
export const childrenService = {
  getAll: (parentId: string): Promise<Child[]> => {
    return new Promise((resolve) => {
      const children: Child[] = JSON.parse(localStorage.getItem('children') || '[]');
      const filteredChildren = children.filter(child => child.parent_id === parentId);
      resolve(filteredChildren);
    });
  },
  
  getOne: (id: string): Promise<Child> => {
    return new Promise((resolve, reject) => {
      const children: Child[] = JSON.parse(localStorage.getItem('children') || '[]');
      const child = children.find(c => c.id === id);
      
      if (child) {
        resolve(child);
      } else {
        reject(new Error('Child not found'));
      }
    });
  },
  
  create: (childData: Omit<Child, 'id'>): Promise<Child> => {
    return new Promise((resolve) => {
      const children: Child[] = JSON.parse(localStorage.getItem('children') || '[]');
      
      // Create new child
      const newChild: Child = {
        ...childData,
        id: generateId()
      };
      
      // Save to localStorage
      children.push(newChild);
      localStorage.setItem('children', JSON.stringify(children));
      
      resolve(newChild);
    });
  },
  
  update: (id: string, childData: Partial<Child>): Promise<Child> => {
    return new Promise((resolve, reject) => {
      const children: Child[] = JSON.parse(localStorage.getItem('children') || '[]');
      const index = children.findIndex(c => c.id === id);
      
      if (index !== -1) {
        // Update child
        children[index] = { ...children[index], ...childData };
        localStorage.setItem('children', JSON.stringify(children));
        
        resolve(children[index]);
      } else {
        reject(new Error('Child not found'));
      }
    });
  },
  
  delete: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const children: Child[] = JSON.parse(localStorage.getItem('children') || '[]');
      const index = children.findIndex(c => c.id === id);
      
      if (index !== -1) {
        // Remove child
        children.splice(index, 1);
        localStorage.setItem('children', JSON.stringify(children));
        
        resolve();
      } else {
        reject(new Error('Child not found'));
      }
    });
  }
};

// Vaccine services
export const vaccineService = {
  getAll: (): Promise<Vaccine[]> => {
    return new Promise((resolve) => {
      const vaccines: Vaccine[] = JSON.parse(localStorage.getItem('vaccines') || '[]');
      resolve(vaccines);
    });
  },
  
  getOne: (id: string): Promise<Vaccine> => {
    return new Promise((resolve, reject) => {
      const vaccines: Vaccine[] = JSON.parse(localStorage.getItem('vaccines') || '[]');
      const vaccine = vaccines.find(v => v.id === id);
      
      if (vaccine) {
        resolve(vaccine);
      } else {
        reject(new Error('Vaccine not found'));
      }
    });
  }
};

// Appointment services
export const appointmentService = {
  getAll: (parentId: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const filteredAppointments = appointments.filter(appointment => appointment.parent_id === parentId);
      resolve(filteredAppointments);
    });
  },
  
  getByDoctor: (doctorId: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const filteredAppointments = appointments.filter(appointment => appointment.doctor_id === doctorId);
      resolve(filteredAppointments);
    });
  },
  
  getOne: (id: string): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const appointment = appointments.find(a => a.id === id);
      
      if (appointment) {
        resolve(appointment);
      } else {
        reject(new Error('Appointment not found'));
      }
    });
  },
  
  create: (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
    return new Promise((resolve) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // Create new appointment
      const newAppointment: Appointment = {
        ...appointmentData,
        id: generateId()
      };
      
      // Save to localStorage
      appointments.push(newAppointment);
      localStorage.setItem('appointments', JSON.stringify(appointments));
      
      resolve(newAppointment);
    });
  },
  
  update: (id: string, appointmentData: Partial<Appointment>): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const index = appointments.findIndex(a => a.id === id);
      
      if (index !== -1) {
        // Update appointment
        appointments[index] = { ...appointments[index], ...appointmentData };
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        resolve(appointments[index]);
      } else {
        reject(new Error('Appointment not found'));
      }
    });
  },
  
  accept: (id: string): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const index = appointments.findIndex(a => a.id === id);
      
      if (index !== -1) {
        // Update appointment status to confirmed
        appointments[index] = { 
          ...appointments[index], 
          status: 'confirmed' 
        };
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        resolve(appointments[index]);
      } else {
        reject(new Error('Appointment not found'));
      }
    });
  },
  
  reject: (id: string, reason: string): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const index = appointments.findIndex(a => a.id === id);
      
      if (index !== -1) {
        // Update appointment status to rejected
        appointments[index] = { 
          ...appointments[index], 
          status: 'rejected',
          rejection_reason: reason
        };
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        resolve(appointments[index]);
      } else {
        reject(new Error('Appointment not found'));
      }
    });
  },
  
  complete: (id: string): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const index = appointments.findIndex(a => a.id === id);
      
      if (index !== -1) {
        // Update appointment status to completed
        appointments[index] = { 
          ...appointments[index], 
          status: 'completed' 
        };
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        // Create a vaccination record for the completed appointment
        const completedAppointment = appointments[index];
        const records: VaccinationRecord[] = JSON.parse(localStorage.getItem('vaccination_records') || '[]');
        
        // Check if a record already exists for this appointment
        const existingRecord = records.find(r => r.appointment_id === completedAppointment.id);
        
        if (!existingRecord) {
          // Get doctor information
          const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
          const doctor = users.find(u => u.id === completedAppointment.doctor_id);
          
          // Get child information to verify it exists
          const children: Child[] = JSON.parse(localStorage.getItem('children') || '[]');
          const child = children.find(c => c.id === completedAppointment.child_id);
          
          if (!child) {
            console.error(`Child with ID ${completedAppointment.child_id} not found for vaccination record`);
          } else {
            console.log(`Found child for vaccination record: ${child.first_name} ${child.last_name}`);
          }
          
          // Create new vaccination record
          const newRecord: VaccinationRecord = {
            id: generateId(),
            child_id: completedAppointment.child_id,
            vaccine_id: completedAppointment.vaccine_id || 'general-checkup',
            vaccine_name: completedAppointment.reason || 'General Checkup',
            vaccination_date: completedAppointment.date,
            doctor_id: completedAppointment.doctor_id,
            doctor_first_name: doctor ? doctor.firstName : 'Unknown',
            doctor_last_name: doctor ? doctor.lastName : 'Doctor',
            notes: completedAppointment.notes || '',
            status: 'completed',
            appointment_id: completedAppointment.id
          };
          
          console.log('Creating vaccination record:', newRecord);
          records.push(newRecord);
          localStorage.setItem('vaccination_records', JSON.stringify(records));
          console.log('Created vaccination record:', newRecord);
        }
        
        resolve(appointments[index]);
      } else {
        reject(new Error('Appointment not found'));
      }
    });
  },
  
  delete: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const index = appointments.findIndex(a => a.id === id);
      
      if (index !== -1) {
        // Remove appointment
        appointments.splice(index, 1);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        resolve();
      } else {
        reject(new Error('Appointment not found'));
      }
    });
  }
};

// Vaccination record services
export const vaccinationRecordService = {
  getAll: (): Promise<VaccinationRecord[]> => {
    return new Promise((resolve) => {
      const records: VaccinationRecord[] = JSON.parse(localStorage.getItem('vaccination_records') || '[]');
      resolve(records);
    });
  },
  
  getByChild: (childId: string): Promise<VaccinationRecord[]> => {
    return new Promise((resolve) => {
      const records: VaccinationRecord[] = JSON.parse(localStorage.getItem('vaccination_records') || '[]');
      const filteredRecords = records.filter(record => record.child_id === childId);
      resolve(filteredRecords);
    });
  },
  
  create: (recordData: Omit<VaccinationRecord, 'id'>): Promise<VaccinationRecord> => {
    return new Promise((resolve) => {
      const records: VaccinationRecord[] = JSON.parse(localStorage.getItem('vaccination_records') || '[]');
      
      // Create new record
      const newRecord: VaccinationRecord = {
        ...recordData,
        id: generateId()
      };
      
      // Save to localStorage
      records.push(newRecord);
      localStorage.setItem('vaccination_records', JSON.stringify(records));
      
      resolve(newRecord);
    });
  },
  
  update: (id: string, recordData: Partial<VaccinationRecord>): Promise<VaccinationRecord> => {
    return new Promise((resolve, reject) => {
      const records: VaccinationRecord[] = JSON.parse(localStorage.getItem('vaccination_records') || '[]');
      const index = records.findIndex(r => r.id === id);
      
      if (index !== -1) {
        // Update record
        records[index] = { ...records[index], ...recordData };
        localStorage.setItem('vaccination_records', JSON.stringify(records));
        
        resolve(records[index]);
      } else {
        reject(new Error('Vaccination record not found'));
      }
    });
  },
  
  delete: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const records: VaccinationRecord[] = JSON.parse(localStorage.getItem('vaccination_records') || '[]');
      const index = records.findIndex(r => r.id === id);
      
      if (index !== -1) {
        // Remove record
        records.splice(index, 1);
        localStorage.setItem('vaccination_records', JSON.stringify(records));
        
        resolve();
      } else {
        reject(new Error('Vaccination record not found'));
      }
    });
  }
};

// Doctor services
export const doctorService = {
  getAll: (): Promise<Doctor[]> => {
    return new Promise((resolve) => {
      const doctors: Doctor[] = JSON.parse(localStorage.getItem('doctors') || '[]');
      resolve(doctors);
    });
  },
  
  getOne: (id: string): Promise<Doctor> => {
    return new Promise((resolve, reject) => {
      const doctors: Doctor[] = JSON.parse(localStorage.getItem('doctors') || '[]');
      const doctor = doctors.find(d => d.id === id);
      
      if (doctor) {
        resolve(doctor);
      } else {
        reject(new Error('Doctor not found'));
      }
    });
  }
};

// Initialize localStorage when this module is imported
initializeLocalStorage();

export default {
  authService,
  childrenService,
  vaccineService,
  appointmentService,
  vaccinationRecordService,
  doctorService,
  initializeLocalStorage
}; 