-- Insert sample vaccines first
INSERT INTO vaccines (vaccine_name, description, recommended_age, doses_required, disease_prevented, manufacturer) VALUES
('BCG', 'Bacillus Calmette-Guérin vaccine', 'At birth', 1, 'Tuberculosis', 'Serum Institute'),
('OPV', 'Oral Polio Vaccine', '6 weeks, 10 weeks, 14 weeks', 3, 'Poliomyelitis', 'Bio-Med'),
('DPT', 'Diphtheria, Pertussis, Tetanus', '6 weeks, 10 weeks, 14 weeks', 3, 'Diphtheria, Pertussis, Tetanus', 'Biological E'),
('MMR', 'Measles, Mumps, Rubella', '12 months', 2, 'Measles, Mumps, Rubella', 'GSK');

-- Insert sample users (doctors and parents)
INSERT INTO users (email, password, role, first_name, last_name, phone_number) VALUES
-- Doctors (password is hashed version of 'password123')
('doctor1@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'doctor', 'John', 'Smith', '1234567890'),
('doctor2@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'doctor', 'Sarah', 'Johnson', '2345678901'),
-- Parents
('parent1@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'parent', 'Michael', 'Brown', '3456789012'),
('parent2@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'parent', 'Emily', 'Davis', '4567890123'),
-- Admin
('admin@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'admin', 'Admin', 'User', '5678901234');

-- Insert doctor details
INSERT INTO doctor_details (doctor_id, specialization, license_number, hospital_name, years_of_experience) VALUES
(1, 'Pediatrician', 'MED123456', 'City Hospital', 10),
(2, 'Pediatrician', 'MED789012', 'Central Hospital', 8);

-- Insert children for parents
INSERT INTO children (parent_id, first_name, last_name, date_of_birth, gender, blood_group, allergies) VALUES
(3, 'James', 'Brown', '2022-01-15', 'male', 'A+', 'None'),
(3, 'Sophie', 'Brown', '2023-03-20', 'female', 'B+', 'Peanuts'),
(4, 'Oliver', 'Davis', '2022-06-10', 'male', 'O+', 'None'),
(4, 'Emma', 'Davis', '2023-08-25', 'female', 'AB+', 'None');

-- Insert vaccination schedules
INSERT INTO vaccination_schedule (child_id, vaccine_id, dose_number, scheduled_date, status) VALUES
-- For James Brown
(1, 1, 1, '2022-01-15', 'completed'),
(1, 2, 1, '2022-03-15', 'completed'),
(1, 3, 1, '2022-05-15', 'pending'),
-- For Sophie Brown
(2, 1, 1, '2023-03-20', 'completed'),
(2, 2, 1, '2023-05-20', 'pending'),
-- For Oliver Davis
(3, 1, 1, '2022-06-10', 'completed'),
(3, 2, 1, '2022-08-10', 'completed'),
-- For Emma Davis
(4, 1, 1, '2023-08-25', 'completed');

-- Insert vaccination records
INSERT INTO vaccination_records (child_id, vaccine_id, doctor_id, dose_number, vaccination_date, batch_number, next_due_date) VALUES
(1, 1, 1, 1, '2022-01-15', 'BCG123', NULL),
(1, 2, 1, 1, '2022-03-15', 'OPV123', '2022-07-15'),
(2, 1, 2, 1, '2023-03-20', 'BCG124', NULL),
(3, 1, 1, 1, '2022-06-10', 'BCG125', NULL),
(3, 2, 2, 1, '2022-08-10', 'OPV124', '2022-12-10'),
(4, 1, 2, 1, '2023-08-25', 'BCG126', NULL);

-- Insert appointments
INSERT INTO appointments (child_id, doctor_id, schedule_id, appointment_date, appointment_time, status, reason) VALUES
(1, 1, 3, '2024-04-01', '10:00:00', 'scheduled', 'DPT First Dose'),
(2, 2, 5, '2024-04-02', '11:00:00', 'scheduled', 'OPV First Dose'),
(3, 1, NULL, '2024-04-03', '14:00:00', 'scheduled', 'Regular Checkup');

-- Insert notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(3, 'Upcoming Vaccination', 'DPT vaccination due for James on April 1st', 'vaccination_due'),
(4, 'Appointment Reminder', 'Regular checkup for Oliver on April 3rd', 'appointment'),
(1, 'New Appointment', 'New appointment scheduled with James Brown', 'appointment'); 