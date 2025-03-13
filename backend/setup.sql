DROP DATABASE IF EXISTS child_vaccination;
CREATE DATABASE child_vaccination;
USE child_vaccination;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('parent', 'doctor', 'admin') NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create children table
CREATE TABLE IF NOT EXISTS children (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    blood_group VARCHAR(10),
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create vaccines table
CREATE TABLE IF NOT EXISTS vaccines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    recommended_age VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vaccination_records table
CREATE TABLE IF NOT EXISTS vaccination_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    child_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    vaccination_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE
);

-- Doctor details table
CREATE TABLE doctor_details (
    doctor_id INT PRIMARY KEY,
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    hospital_name VARCHAR(255),
    years_of_experience INT,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Vaccination schedule table
CREATE TABLE vaccination_schedule (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    child_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    dose_number INT DEFAULT 1,
    scheduled_date DATE NOT NULL,
    status ENUM('pending', 'completed', 'missed', 'rescheduled') DEFAULT 'pending',
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    child_id INT NOT NULL,
    doctor_id INT NOT NULL,
    schedule_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES vaccination_schedule(schedule_id) ON DELETE SET NULL
);

-- Chat logs table
CREATE TABLE chat_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (email, password, first_name, last_name, role, phone_number) VALUES
('doctor1@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'John', 'Smith', 'doctor', '555-1234'),
('doctor2@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'Sarah', 'Johnson', 'doctor', '555-5678'),
('parent1@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'Michael', 'Brown', 'parent', '555-9012'),
('parent2@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'Emily', 'Davis', 'parent', '555-3456'),
('admin@example.com', '$2a$10$6KqMH.9bLhH/Kp.0UKzL2eKB0xg3YqU1Eg6WUlKH1Iv0JUhJzrKIi', 'Admin', 'User', 'admin', '555-7890');

-- Insert doctor details
INSERT INTO doctor_details (doctor_id, specialization, license_number, hospital_name, years_of_experience) VALUES
(1, 'Pediatrician', 'MED123456', 'City Hospital', 10),
(2, 'Pediatrician', 'MED789012', 'Central Hospital', 8);

-- Insert sample vaccines
INSERT INTO vaccines (name, description, recommended_age) VALUES
('BCG', 'Bacillus Calmette–Guérin vaccine', 'At birth'),
('OPV', 'Oral Polio Vaccine', '0-5 years'),
('DPT', 'Diphtheria, Pertussis, and Tetanus vaccine', '6 weeks'),
('MMR', 'Measles, Mumps, and Rubella vaccine', '12 months'),
('Hepatitis B', 'Hepatitis B vaccine', 'At birth');

-- Insert a default parent user for testing
INSERT INTO users (first_name, last_name, email, password, role, phone_number)
VALUES ('Test', 'Parent', 'test@example.com', 'password123', 'parent', '1234567890'); 