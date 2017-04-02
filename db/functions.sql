BEGIN;

-- Student's full name
CREATE FUNCTION tutor_room.student_full_name(student tutor_room.student)
  RETURNS TEXT AS $$
SELECT student.first_name || ' ' || student.last_name
$$ LANGUAGE SQL STABLE;

-- Mutation functions
CREATE FUNCTION tutor_room.start_visit(a_number TEXT, crn INTEGER, reason tutor_room.tutoring_reason, description TEXT)
  RETURNS tutor_room.visit AS $$
INSERT INTO
  tutor_room.visit (student_id, crn, reason, description, time_in)
  SELECT id AS student_id, $2, $3, $4, current_timestamp FROM tutor_room.student WHERE a_number = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE FUNCTION tutor_room.claim_visit(visit_id INTEGER, tutor_id INTEGER)
  RETURNS tutor_room.visit AS $$
UPDATE
  tutor_room.visit
SET
  (tutor_id, time_claimed) = ($2, current_timestamp)
WHERE
  id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

COMMIT;
