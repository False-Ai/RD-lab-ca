-- Run this command first to create the database:
-- CREATE DATABASE gym_db;

-- 1. members
CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    dob DATE,
    join_date DATE,
    status VARCHAR(20),
    emergency_contact VARCHAR(50)
);

-- 2. trainers
CREATE TABLE trainers (
    trainer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    specialization VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(10,2),
    experience_years INT,
    bio TEXT
);

-- 3. plans
CREATE TABLE plans (
    plan_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_months INT,
    price DECIMAL(10,2),
    setup_fee DECIMAL(10,2),
    status VARCHAR(20),
    max_members INT,
    feature_list TEXT,
    terms TEXT
);

-- 4. equipments
CREATE TABLE equipments (
    equipment_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    brand VARCHAR(50),
    purchase_date DATE,
    price DECIMAL(10,2),
    warranty_expiry DATE,
    condition VARCHAR(50),
    last_maintenance DATE,
    location_id INT
);

-- 5. classes
CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    trainer_id INT,
    schedule_time TIMESTAMP,
    capacity INT,
    difficulty_level VARCHAR(50),
    duration_mins INT,
    location_id INT,
    status VARCHAR(20)
);

-- 6. locations
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    phone VARCHAR(20),
    manager_name VARCHAR(100),
    capacity INT,
    opening_hours VARCHAR(100)
);

-- 7. payments
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    member_id INT,
    amount DECIMAL(10,2),
    payment_date DATE,
    method VARCHAR(50),
    status VARCHAR(20),
    transaction_ref VARCHAR(100),
    discount_applied DECIMAL(10,2),
    late_fee DECIMAL(10,2),
    notes TEXT
);

-- 8. attendances
CREATE TABLE attendances (
    attendance_id SERIAL PRIMARY KEY,
    member_id INT,
    class_id INT,
    attendance_date DATE,
    check_in_time TIME,
    check_out_time TIME,
    status VARCHAR(20),
    notes TEXT,
    verified_by VARCHAR(50),
    device_id VARCHAR(50)
);

-- 9. feedbacks
CREATE TABLE feedbacks (
    feedback_id SERIAL PRIMARY KEY,
    member_id INT,
    feedback_date DATE,
    rating INT,
    category VARCHAR(50),
    subject VARCHAR(100),
    comments TEXT,
    status VARCHAR(20),
    resolved_by VARCHAR(50),
    resolution_date DATE
);

-- 10. promotions
CREATE TABLE promotions (
    promo_id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50),
    discount_value DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    max_uses INT,
    current_uses INT,
    status VARCHAR(20)
);
