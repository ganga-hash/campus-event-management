# Database Documentation - College Fest Management System

This document describes the complete database design used by the project, including:
- all tables and columns
- keys and constraints
- relationships and cardinality
- triggers
- views
- seed-data notes

## Database Basics

- Database name: college_fest
- SQL files:
  - schema.sql
  - triggers.sql
  - views.sql
  - seed.sql

## Setup Order

Run SQL files in this order:

```sql
source database/schema.sql
source database/triggers.sql
source database/views.sql
source database/seed.sql
```

## Entity Relationship Diagram

```mermaid
erDiagram
    Category ||--o{ Event : categorizes
    Student ||--o{ Registration : registers
    Event ||--o{ Registration : receives

    Student ||--o| Volunteer : can_be
    Volunteer ||--o{ Assignment : gets
    Event ||--o{ Assignment : has

    Event ||--o{ Event_Sponsor : linked_by
    Sponsor ||--o{ Event_Sponsor : funds

    Category {
        int category_id PK
        varchar name
        text description
        timestamp created_at
    }

    Student {
        int student_id PK
        varchar name
        varchar email UK
        varchar password_hash
        varchar department
        int year
        varchar phone
        enum role
        timestamp created_at
    }

    Event {
        int event_id PK
        varchar name
        text description
        int category_id FK
        date date
        time time
        varchar venue
        int max_participants
        int current_participants
        varchar prize_pool
        varchar image_url
        enum status
        timestamp created_at
    }

    Registration {
        int registration_id PK
        int student_id FK
        int event_id FK
        timestamp registered_at
        enum status
    }

    Volunteer {
        int volunteer_id PK
        int student_id FK_UK
        text skills
        varchar availability
        enum status
        int total_hours
        timestamp created_at
    }

    Assignment {
        int assignment_id PK
        int volunteer_id FK
        int event_id FK
        varchar role
        timestamp assigned_at
        decimal hours_worked
    }

    Sponsor {
        int sponsor_id PK
        varchar name
        varchar contact_email
        varchar contact_phone
        varchar logo_url
        enum tier
        varchar website
        timestamp created_at
    }

    Event_Sponsor {
        int id PK
        int event_id FK
        int sponsor_id FK
        decimal sponsorship_amount
    }
```

## Tables and Constraints

### 1) Category

Purpose:
- master table for event categories

Columns:
- category_id: INT, PK, AUTO_INCREMENT
- name: VARCHAR(100), NOT NULL
- description: TEXT
- created_at: TIMESTAMP, default current timestamp

Constraints:
- Primary key on category_id

---

### 2) Student

Purpose:
- stores all authenticated users (students and admins)

Columns:
- student_id: INT, PK, AUTO_INCREMENT
- name: VARCHAR(150), NOT NULL
- email: VARCHAR(150), NOT NULL
- password_hash: VARCHAR(255), NOT NULL
- department: VARCHAR(100)
- year: INT, NOT NULL
- phone: VARCHAR(15)
- role: ENUM('student', 'admin'), default 'student'
- created_at: TIMESTAMP, default current timestamp

Constraints:
- Primary key on student_id
- Unique key on email
- Check constraint on year: BETWEEN 1 AND 4

---

### 3) Event

Purpose:
- event master table

Columns:
- event_id: INT, PK, AUTO_INCREMENT
- name: VARCHAR(200), NOT NULL
- description: TEXT
- category_id: INT, nullable FK
- date: DATE, NOT NULL
- time: TIME
- venue: VARCHAR(200)
- max_participants: INT, NOT NULL
- current_participants: INT, default 0
- prize_pool: VARCHAR(100)
- image_url: VARCHAR(255)
- status: ENUM('upcoming', 'ongoing', 'completed', 'cancelled'), default 'upcoming'
- created_at: TIMESTAMP, default current timestamp

Constraints:
- Primary key on event_id
- Check constraint: max_participants > 0
- Foreign key category_id -> Category(category_id) ON DELETE SET NULL

---

### 4) Registration

Purpose:
- links students to events as participants

Columns:
- registration_id: INT, PK, AUTO_INCREMENT
- student_id: INT, NOT NULL, FK
- event_id: INT, NOT NULL, FK
- registered_at: TIMESTAMP, default current timestamp
- status: ENUM('confirmed', 'waitlisted', 'cancelled'), default 'confirmed'

Constraints:
- Primary key on registration_id
- Unique key unique_registration(student_id, event_id)
- Foreign key student_id -> Student(student_id) ON DELETE CASCADE
- Foreign key event_id -> Event(event_id) ON DELETE CASCADE

---

### 5) Volunteer

Purpose:
- volunteer profile for a student

Columns:
- volunteer_id: INT, PK, AUTO_INCREMENT
- student_id: INT, NOT NULL, FK
- skills: TEXT
- availability: VARCHAR(200)
- status: ENUM('active', 'inactive'), default 'active'
- total_hours: INT, default 0
- created_at: TIMESTAMP, default current timestamp

Constraints:
- Primary key on volunteer_id
- Unique key on student_id (one volunteer profile per student)
- Foreign key student_id -> Student(student_id) ON DELETE CASCADE

---

### 6) Assignment

Purpose:
- maps volunteers to events and tracks hours

Columns:
- assignment_id: INT, PK, AUTO_INCREMENT
- volunteer_id: INT, NOT NULL, FK
- event_id: INT, NOT NULL, FK
- role: VARCHAR(100)
- assigned_at: TIMESTAMP, default current timestamp
- hours_worked: DECIMAL(5,2), default 0

Constraints:
- Primary key on assignment_id
- Unique key unique_assignment(volunteer_id, event_id)
- Foreign key volunteer_id -> Volunteer(volunteer_id) ON DELETE CASCADE
- Foreign key event_id -> Event(event_id) ON DELETE CASCADE

---

### 7) Sponsor

Purpose:
- sponsor master records

Columns:
- sponsor_id: INT, PK, AUTO_INCREMENT
- name: VARCHAR(200), NOT NULL
- contact_email: VARCHAR(150)
- contact_phone: VARCHAR(15)
- logo_url: VARCHAR(255)
- tier: ENUM('platinum', 'gold', 'silver', 'bronze'), default 'silver'
- website: VARCHAR(255)
- created_at: TIMESTAMP, default current timestamp

Constraints:
- Primary key on sponsor_id

---

### 8) Event_Sponsor

Purpose:
- junction table for many-to-many between Event and Sponsor

Columns:
- id: INT, PK, AUTO_INCREMENT
- event_id: INT, NOT NULL, FK
- sponsor_id: INT, NOT NULL, FK
- sponsorship_amount: DECIMAL(10,2)

Constraints:
- Primary key on id
- Unique key unique_event_sponsor(event_id, sponsor_id)
- Foreign key event_id -> Event(event_id) ON DELETE CASCADE
- Foreign key sponsor_id -> Sponsor(sponsor_id) ON DELETE CASCADE

## Relationship Summary

- Category 1 -> many Event
- Student 1 -> many Registration
- Event 1 -> many Registration
- Student 1 -> 0 or 1 Volunteer
- Volunteer 1 -> many Assignment
- Event 1 -> many Assignment
- Event many <-> many Sponsor through Event_Sponsor

## Triggers

Defined in triggers.sql.

### before_registration_insert

- Timing: BEFORE INSERT on Registration
- Purpose: prevents over-registration
- Logic:
  - reads Event.current_participants and Event.max_participants
  - if current >= max, throws SQLSTATE 45000 with message:
    - Event is full. Registration not allowed.

### after_registration_insert

- Timing: AFTER INSERT on Registration
- Purpose: maintain participant count
- Logic:
  - if NEW.status is confirmed, increments Event.current_participants by 1

### after_registration_update

- Timing: AFTER UPDATE on Registration
- Purpose: maintain participant count when cancelling
- Logic:
  - if status changes from confirmed -> cancelled, decrements Event.current_participants by 1

### after_assignment_update

- Timing: AFTER UPDATE on Assignment
- Purpose: keep Volunteer.total_hours in sync
- Logic:
  - recalculates SUM(hours_worked) for the volunteer
  - updates Volunteer.total_hours (coalesce to 0)

## Views

Defined in views.sql.

### Event_Report

Purpose:
- event-level reporting with participant count

Includes:
- event identity and metadata
- category name
- total confirmed participants
- status and prize_pool

Join/group pattern:
- Event left join Category
- Event left join Registration (confirmed only)
- grouped by event attributes

### Volunteer_Report

Purpose:
- volunteer summary per person

Includes:
- volunteer identity via Student profile
- total events assigned
- sum of worked hours
- volunteer status

Join/group pattern:
- Volunteer join Student
- Volunteer left join Assignment
- grouped by volunteer and student profile fields

### Student_Registration_Report

Purpose:
- student participation summary

Includes:
- student profile fields
- total confirmed registrations
- comma-separated registered event names

Join/group pattern:
- Student left join Registration (confirmed only)
- Registration left join Event
- filter role = student
- grouped by student fields

### Sponsor_Event_Summary

Purpose:
- sponsor contribution overview

Includes:
- sponsor identity and tier
- number of sponsored events
- total contribution amount

Join/group pattern:
- Sponsor left join Event_Sponsor
- grouped by sponsor fields

## Seed Data Notes

Defined in seed.sql.

- Categories: 8
- Students: 51 (50 students + 1 admin)
- Events: 20
- Registrations: sample confirmed registrations
- Volunteers: 15
- Assignments: 15
- Sponsors: 10
- Event_Sponsor rows: 12

Notes:
- Student password_hash values in seed are placeholders.
- Event prize_pool values are stored as text and include formatted rupee strings in sample data.

## Design Notes

- Capacity control is enforced in database via trigger and mirrored in backend validations.
- Unique keys protect duplicate registration, assignment, and sponsor links.
- ON DELETE CASCADE is used for most child rows to avoid orphan records.
- Category uses ON DELETE SET NULL to preserve events when categories are removed.

## Useful Verification Queries

```sql
-- list all tables
SHOW TABLES;

-- inspect constraints and indexes quickly
SHOW CREATE TABLE Student;
SHOW CREATE TABLE Event;
SHOW CREATE TABLE Registration;
SHOW CREATE TABLE Volunteer;
SHOW CREATE TABLE Assignment;
SHOW CREATE TABLE Sponsor;
SHOW CREATE TABLE Event_Sponsor;

-- inspect views
SHOW FULL TABLES WHERE Table_type = 'VIEW';
SHOW CREATE VIEW Event_Report;
SHOW CREATE VIEW Volunteer_Report;
SHOW CREATE VIEW Student_Registration_Report;
SHOW CREATE VIEW Sponsor_Event_Summary;

-- inspect triggers
SHOW TRIGGERS;
```
