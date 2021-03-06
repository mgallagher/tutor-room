BEGIN;

CREATE OR REPLACE FUNCTION tutor_room.current_student()
  RETURNS tutor_room.student AS $$
SELECT *
FROM tutor_room.student s
WHERE s.a_number = current_setting('jwt.claims.a_number', true) :: TEXT
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION tutor_room.current_tutor()
  RETURNS tutor_room.tutor AS $$
SELECT *
FROM tutor_room.tutor t
WHERE t.id = current_setting('jwt.claims.usu_id', true) :: INTEGER
$$ LANGUAGE SQL STABLE;

-- Mutation functions
CREATE OR REPLACE FUNCTION tutor_room_private.start_session(a_number TEXT, course_id INTEGER, reason tutor_room.session_reason, description TEXT)
  RETURNS tutor_room.session AS $$
INSERT INTO
  tutor_room.session (student_id, course_id, reason, description, time_in)
  SELECT id AS student_id, $2, $3, $4, current_timestamp FROM tutor_room.student as a WHERE a.a_number = start_session.a_number
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE OR REPLACE FUNCTION tutor_room.start_session(course_id INTEGER, reason tutor_room.session_reason, description TEXT)
  RETURNS tutor_room.session AS $$
SELECT tutor_room_private.start_session(current_setting('jwt.claims.a_number'), $1, $2, $3)
$$ LANGUAGE SQL VOLATILE;


CREATE OR REPLACE FUNCTION tutor_room_private.claim_session(session_id INTEGER, tutor_id INTEGER)
  RETURNS tutor_room.session AS $$
UPDATE
  tutor_room.session
SET
  (tutor_id, time_claimed) = ($2, current_timestamp)
WHERE
  id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE OR REPLACE FUNCTION tutor_room.claim_session(session_id INTEGER)
  RETURNS tutor_room.session AS $$
SELECT tutor_room_private.claim_session($1, current_setting('jwt.claims.usu_id')::INTEGER)
$$ LANGUAGE SQL VOLATILE;


CREATE OR REPLACE FUNCTION tutor_room_private.finish_session(session_id INTEGER, tag tutor_room.session_tag default NULL, notes TEXT default NULL, requeued BOOLEAN default false)
  RETURNS tutor_room.session AS $$
UPDATE
  tutor_room.session
SET
  (time_out, tutor_tag, tutor_notes, requeued) = (current_timestamp, $2, $3, $4)
WHERE
  id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE OR REPLACE FUNCTION tutor_room.finish_session(session_id INTEGER, tag tutor_room.session_tag default NULL, notes TEXT default NULL, requeued BOOLEAN default false)
  RETURNS tutor_room.session AS $$
SELECT tutor_room_private.finish_session($1, $2, $3, $4)
$$ LANGUAGE SQL VOLATILE;


CREATE OR REPLACE FUNCTION tutor_room.delete_session(session_id INTEGER)
  RETURNS tutor_room.session AS $$
DELETE FROM tutor_room.session
WHERE id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;


CREATE OR REPLACE FUNCTION tutor_room.copy_session(session_id INTEGER)
  RETURNS tutor_room.session AS $$
INSERT INTO tutor_room.session (student_id, course_id, reason, time_in, description)
SELECT student_id, course_id, reason, time_in, description FROM tutor_room.session WHERE id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;


CREATE OR REPLACE FUNCTION tutor_room.latest_average_wait()
  RETURNS INTERVAL AS $$
  WITH claimed_sessions AS (
    SELECT * FROM tutor_room.session WHERE time_in IS NOT NULL AND time_claimed IS NOT NULL
  )
  SELECT AVG(time_claimed - time_in) average_wait FROM claimed_sessions WHERE time_in > (now() - INTERVAL '1 hour');
$$
LANGUAGE SQL STABLE;

-- Definitely only for development purposes!
-- CREATE FUNCTION reset_sessions() returns void
-- LANGUAGE SQL
-- AS $$
-- UPDATE
--   tutor_room.session
-- SET
--   (tutor_id, time_claimed, time_out, tutor_tag, tutor_notes) = (NULL, NULL, NULL, NULL, NULL)
-- $$;

COMMIT;
