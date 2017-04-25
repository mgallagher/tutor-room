BEGIN;

-- Student's full name
CREATE FUNCTION tutor_room.student_full_name(student tutor_room.student)
  RETURNS TEXT AS $$
SELECT student.first_name || ' ' || student.last_name
$$ LANGUAGE SQL STABLE;

-- Mutation functions
CREATE FUNCTION tutor_room.start_session(a_number TEXT, crn INTEGER, reason tutor_room.tutoring_reason, description TEXT)
  RETURNS tutor_room.session AS $$
INSERT INTO
  tutor_room.session (student_id, crn, reason, description, time_in)
  SELECT id AS student_id, $2, $3, $4, current_timestamp FROM tutor_room.student WHERE a_number = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE FUNCTION tutor_room.claim_session(session_id INTEGER, tutor_id INTEGER)
  RETURNS tutor_room.session AS $$
UPDATE
  tutor_room.session
SET
  (tutor_id, time_claimed) = ($2, current_timestamp)
WHERE
  id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE OR REPLACE FUNCTION tutor_room.finish_session(session_id INTEGER, requeued BOOLEAN default false)
  RETURNS tutor_room.session AS $$
UPDATE
  tutor_room.session
SET
  (time_out, requeued) = (current_timestamp, $2)
WHERE
  id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE OR REPLACE FUNCTION tutor_room.requeue_session(session_id INTEGER)
  RETURNS setof tutor_room.session AS $$
  WITH
      finished_session AS (
        SELECT *
        FROM tutor_room.finish_session($1, requeued => TRUE)
    ),
      copied_session AS (
        SELECT copied.*
        FROM finished_session f
          JOIN tutor_room.student s ON (f.student_id = s.id)
          , tutor_room.start_session(s.a_number, f.crn, f.reason, f.description) copied
    )
  SELECT * FROM finished_session
  UNION
  SELECT * FROM copied_session;
$$ LANGUAGE SQL VOLATILE;

-- Only for development purposes!
CREATE FUNCTION reset_sessions() RETURNS void
AS $$
UPDATE
  tutor_room.session
SET
  (time_claimed, time_out) = (NULL, NULL)
$$ LANGUAGE sql

COMMIT;
