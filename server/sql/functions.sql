BEGIN;

create function something.current_a_number() returns int as $$
select current_setting('jwt.claims.a_number')::int;
$$ language sql stable;

-- Mutation functions
CREATE FUNCTION tutor_room_private.start_session(a_number TEXT, crn INTEGER, reason tutor_room.session_reason, description TEXT)
  RETURNS tutor_room.session AS $$
INSERT INTO
  tutor_room.session (student_id, crn, reason, description, time_in)
  SELECT id AS student_id, $2, $3, $4, current_timestamp FROM tutor_room.student as a WHERE a.a_number = start_session.a_number
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE FUNCTION tutor_room.start_session(crn INTEGER, reason tutor_room.session_reason, description TEXT)
  RETURNS tutor_room.session AS $$
SELECT tutor_room_private.start_session(current_a_number(), $1, $2, $3)
$$ LANGUAGE SQL VOLATILE


CREATE FUNCTION tutor_room_private.claim_session(session_id INTEGER, tutor_id INTEGER)
  RETURNS tutor_room.session AS $$
UPDATE
  tutor_room.session
SET
  (tutor_id, time_claimed) = ($2, current_timestamp)
WHERE
  id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE FUNCTION tutor_room.claim_session(session_id INTEGER)
  RETURNS tutor_room.session AS $$
SELECT tutor_room_private.claim_session($1, current_setting('jwt.claims.usu_id'))
$$ LANGUAGE SQL VOLATILE;


CREATE FUNCTION tutor_room_private.finish_session(session_id INTEGER, tag tutor_room.session_tag default NULL, notes TEXT default NULL, requeued BOOLEAN default false)
  RETURNS tutor_room.session AS $$
UPDATE
  tutor_room.session
SET
  (time_out, tutor_tag, tutor_notes, requeued) = (current_timestamp, $2, $3, $4)
WHERE
  id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;

CREATE FUNCTION tutor_room.finish_session(session_id INTEGER, tag tutor_room.session_tag default NULL, notes TEXT default NULL, requeued BOOLEAN default false)
  RETURNS tutor_room.session AS $$
SELECT tutor_room_private.finish_session($1, $2, $3, $4)
$$ LANGUAGE SQL VOLATILE;


CREATE FUNCTION tutor_room_private.delete_session(session_id INTEGER)
  RETURNS tutor_room.session AS $$
DELETE FROM tutor_room.session
WHERE id = $1
RETURNING *
$$ LANGUAGE SQL VOLATILE;


CREATE FUNCTION tutor_room.requeue_session(session_id INTEGER)
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

CREATE FUNCTION tutor_room.latest_average_wait()
  RETURNS INTERVAL AS $$
  WITH completed_sessions AS (
    SELECT * FROM tutor_room.session WHERE time_in IS NOT NULL AND time_claimed IS NOT NULL AND time_out IS NOT NULL
  )
  SELECT AVG(time_claimed - time_in) average_wait FROM completed_sessions
$$
LANGUAGE SQL STABLE;

-- Only for development purposes!
CREATE FUNCTION reset_sessions() returns void
LANGUAGE SQL
AS $$
UPDATE
  tutor_room.session
SET
  (tutor_id, time_claimed, time_out, tutor_tag, tutor_notes) = (NULL, NULL, NULL, NULL, NULL)
$$;

COMMIT;