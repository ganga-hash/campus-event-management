-- ============================================================
-- College Fest Event & Volunteering Management System
-- schema.sql - Core Tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS college_fest;
USE college_fest;

-- Category Table
CREATE TABLE IF NOT EXISTS Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Table
CREATE TABLE IF NOT EXISTS Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    year INT NOT NULL CHECK (year BETWEEN 1 AND 4),
    phone VARCHAR(15),
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Table
CREATE TABLE IF NOT EXISTS Event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT,
    date DATE NOT NULL,
    time TIME,
    venue VARCHAR(200),
    max_participants INT NOT NULL CHECK (max_participants > 0),
    current_participants INT DEFAULT 0,
    prize_pool VARCHAR(100),
    image_url VARCHAR(255),
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE SET NULL
);

-- Registration Table
CREATE TABLE IF NOT EXISTS Registration (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'waitlisted', 'cancelled') DEFAULT 'confirmed',
    UNIQUE KEY unique_registration (student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

-- Volunteer Table
CREATE TABLE IF NOT EXISTS Volunteer (
    volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    skills TEXT,
    availability VARCHAR(200),
    status ENUM('active', 'inactive') DEFAULT 'active',
    total_hours INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE
);

-- Assignment Table
CREATE TABLE IF NOT EXISTS Assignment (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id INT NOT NULL,
    event_id INT NOT NULL,
    role VARCHAR(100),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hours_worked DECIMAL(5,2) DEFAULT 0,
    UNIQUE KEY unique_assignment (volunteer_id, event_id),
    FOREIGN KEY (volunteer_id) REFERENCES Volunteer(volunteer_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

-- Sponsor Table
CREATE TABLE IF NOT EXISTS Sponsor (
    sponsor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(15),
    logo_url VARCHAR(255),
    tier ENUM('platinum', 'gold', 'silver', 'bronze') DEFAULT 'silver',
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event_Sponsor Junction Table
CREATE TABLE IF NOT EXISTS Event_Sponsor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    sponsor_id INT NOT NULL,
    sponsorship_amount DECIMAL(10,2),
    UNIQUE KEY unique_event_sponsor (event_id, sponsor_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE,
    FOREIGN KEY (sponsor_id) REFERENCES Sponsor(sponsor_id) ON DELETE CASCADE
);
