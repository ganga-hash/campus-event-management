-- ============================================================
-- College Fest - Triggers
-- triggers.sql
-- ============================================================

USE college_fest;

DELIMITER //

-- Trigger 1: Prevent over-registration
CREATE TRIGGER before_registration_insert
BEFORE INSERT ON Registration
FOR EACH ROW
BEGIN
    DECLARE current_count INT;
    DECLARE max_count INT;
    
    SELECT current_participants, max_participants 
    INTO current_count, max_count
    FROM Event WHERE event_id = NEW.event_id;
    
    IF current_count >= max_count THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Event is full. Registration not allowed.';
    END IF;
END //

-- Trigger 2: Increment current_participants after registration
CREATE TRIGGER after_registration_insert
AFTER INSERT ON Registration
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE Event 
        SET current_participants = current_participants + 1
        WHERE event_id = NEW.event_id;
    END IF;
END //

-- Trigger 3: Decrement current_participants on cancellation
CREATE TRIGGER after_registration_update
AFTER UPDATE ON Registration
FOR EACH ROW
BEGIN
    IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
        UPDATE Event 
        SET current_participants = current_participants - 1
        WHERE event_id = NEW.event_id;
    END IF;
END //

-- Trigger 4: Update volunteer total_hours after assignment update
CREATE TRIGGER after_assignment_update
AFTER UPDATE ON Assignment
FOR EACH ROW
BEGIN
    DECLARE total DECIMAL(10,2);
    
    SELECT SUM(hours_worked) INTO total
    FROM Assignment
    WHERE volunteer_id = NEW.volunteer_id;
    
    UPDATE Volunteer 
    SET total_hours = COALESCE(total, 0)
    WHERE volunteer_id = NEW.volunteer_id;
END //

DELIMITER ;
