-- ============================================================
-- College Fest - Views
-- views.sql
-- ============================================================

USE college_fest;

-- View 1: Event_Report - event name, category, total participants
CREATE OR REPLACE VIEW Event_Report AS
SELECT 
    e.event_id,
    e.name AS event_name,
    c.name AS category,
    e.date,
    e.venue,
    e.max_participants,
    COUNT(r.registration_id) AS total_participants,
    e.status,
    e.prize_pool
FROM Event e
LEFT JOIN Category c ON e.category_id = c.category_id
LEFT JOIN Registration r ON e.event_id = r.event_id AND r.status = 'confirmed'
GROUP BY e.event_id, e.name, c.name, e.date, e.venue, e.max_participants, e.status, e.prize_pool;

-- View 2: Volunteer_Report - volunteer details with event assignments
CREATE OR REPLACE VIEW Volunteer_Report AS
SELECT 
    v.volunteer_id,
    s.name AS volunteer_name,
    s.email,
    s.department,
    COUNT(a.assignment_id) AS total_events,
    SUM(a.hours_worked) AS total_hours,
    v.status
FROM Volunteer v
JOIN Student s ON v.student_id = s.student_id
LEFT JOIN Assignment a ON v.volunteer_id = a.volunteer_id
GROUP BY v.volunteer_id, s.name, s.email, s.department, v.status;

-- View 3: Student_Registration_Report
CREATE OR REPLACE VIEW Student_Registration_Report AS
SELECT
    s.student_id,
    s.name AS student_name,
    s.email,
    s.department,
    s.year,
    COUNT(r.registration_id) AS total_registrations,
    GROUP_CONCAT(e.name SEPARATOR ', ') AS registered_events
FROM Student s
LEFT JOIN Registration r ON s.student_id = r.student_id AND r.status = 'confirmed'
LEFT JOIN Event e ON r.event_id = e.event_id
WHERE s.role = 'student'
GROUP BY s.student_id, s.name, s.email, s.department, s.year;

-- View 4: Sponsor_Event_Summary
CREATE OR REPLACE VIEW Sponsor_Event_Summary AS
SELECT
    sp.sponsor_id,
    sp.name AS sponsor_name,
    sp.tier,
    COUNT(es.event_id) AS events_sponsored,
    SUM(es.sponsorship_amount) AS total_contribution
FROM Sponsor sp
LEFT JOIN Event_Sponsor es ON sp.sponsor_id = es.sponsor_id
GROUP BY sp.sponsor_id, sp.name, sp.tier;
