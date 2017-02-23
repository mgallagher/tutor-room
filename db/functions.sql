BEGIN;

-- Student's full name
CREATE FUNCTION tutor_room.students_full_name(student tutor_room.students)
  RETURNS TEXT AS $$
SELECT student.first_name || ' ' || student.last_name
$$ LANGUAGE SQL STABLE;

-- Mutation functions
CREATE FUNCTION tutor_room.claim_visit(visit_id INTEGER, tutor_id INTEGER)
  RETURNS tutor_room.visits AS $$
UPDATE tutor_room.visits
SET (tutor_id, time_claimed) = ($2, current_timestamp)
WHERE
  id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

COMMIT;
