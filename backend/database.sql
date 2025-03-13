-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS child_vaccination;
USE child_vaccination;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('parent', 'doctor', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;

-- Doctor details table
CREATE TABLE IF NOT EXISTS doctor_details (
    doctor_id INT PRIMARY KEY,
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    hospital_name VARCHAR(255),
    years_of_experience INT,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id)
);

-- Create children table
CREATE TABLE IF NOT EXISTS children (
    child_id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    blood_group VARCHAR(5),
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create vaccines table
CREATE TABLE IF NOT EXISTS vaccines (
    vaccine_id INT PRIMARY KEY AUTO_INCREMENT,
    vaccine_name VARCHAR(100) NOT NULL,
    description TEXT,
    recommended_age VARCHAR(50),
    doses_required INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vaccination_schedule table
CREATE TABLE IF NOT EXISTS vaccination_schedule (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    child_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    dose_number INT NOT NULL DEFAULT 1,
    scheduled_date DATE NOT NULL,
    status ENUM('pending', 'completed', 'missed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(child_id) ON DELETE CASCADE,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(vaccine_id) ON DELETE CASCADE
);

-- Create vaccination_records table
CREATE TABLE IF NOT EXISTS vaccination_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    child_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    doctor_id INT NOT NULL,
    vaccination_date DATE NOT NULL,
    dose_number INT NOT NULL DEFAULT 1,
    notes TEXT,
    status ENUM('completed', 'adverse_reaction') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(child_id) ON DELETE CASCADE,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(vaccine_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert some sample vaccines
INSERT INTO vaccines (vaccine_name, description, recommended_age, doses_required) VALUES
('BCG', 'Bacillus Calmette–Guérin vaccine for tuberculosis', 'At birth', 1),
('OPV', 'Oral Polio Vaccine', '2 months', 3),
('DPT', 'Diphtheria, Pertussis, and Tetanus vaccine', '2 months', 3),
('MMR', 'Measles, Mumps, and Rubella vaccine', '12 months', 2),
('Hepatitis B', 'Vaccine for Hepatitis B', 'At birth', 3);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
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
    FOREIGN KEY (child_id) REFERENCES children(child_id),
    FOREIGN KEY (doctor_id) REFERENCES users(user_id),
    FOREIGN KEY (schedule_id) REFERENCES vaccination_schedule(schedule_id)
);

-- Chat logs table
CREATE TABLE chat_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert Indian doctors
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('Arun', 'Patel', 'arun.patel@hospital.com', '$2a$10$your_hashed_password', 'doctor'),
('Priya', 'Sharma', 'priya.sharma@hospital.com', '$2a$10$your_hashed_password', 'doctor'),
('Rajesh', 'Kumar', 'rajesh.kumar@hospital.com', '$2a$10$your_hashed_password', 'doctor'),
('Deepa', 'Gupta', 'deepa.gupta@hospital.com', '$2a$10$your_hashed_password', 'doctor'),
('Suresh', 'Verma', 'suresh.verma@hospital.com', '$2a$10$your_hashed_password', 'doctor'),
('Anita', 'Singh', 'anita.singh@hospital.com', '$2a$10$your_hashed_password', 'doctor'),
('Vikram', 'Malhotra', 'vikram.malhotra@hospital.com', '$2a$10$your_hashed_password', 'doctor'); 