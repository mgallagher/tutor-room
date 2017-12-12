BEGIN;

CREATE SCHEMA tutor_room;
CREATE SCHEMA tutor_room_private;

-- Any particularly sensitive data should live in the private schema
CREATE TABLE tutor_room_private.term (
  code        TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL
);

CREATE TABLE tutor_room.tutor (
  id             INTEGER PRIMARY KEY,
  a_number       TEXT NOT NULL UNIQUE,
  first_name     TEXT,
  last_name      TEXT,
  preferred_name TEXT,
  created        TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE tutor_room.jwt_token as (
  usu_id   INTEGER,
  a_number TEXT,
  role     TEXT
);

CREATE TABLE tutor_room.student (
  id             INTEGER PRIMARY KEY,
  a_number       TEXT NOT NULL UNIQUE,
  first_name     TEXT,
  last_name      TEXT,
  preferred_name TEXT,
  created        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tutor_room.course (
  id            SERIAL PRIMARY KEY,
  crn           INTEGER NOT NULL,
  number        INTEGER NOT NULL,
  title         TEXT NOT NULL,
  term_code     INTEGER NOT NULL,
  UNIQUE (crn, number, term_code)
);

CREATE TABLE tutor_room.student_course (
  student_id INTEGER NOT NULL REFERENCES tutor_room.student (id),
  course_id  INTEGER NOT NULL REFERENCES tutor_room.course (id),
  PRIMARY KEY (student_id, course_id)
);

CREATE TYPE tutor_room.session_reason AS ENUM (
  'debugging',
  'syntax',
  'concept',
  'program_design'
);

CREATE TYPE tutor_room.session_tag AS ENUM (
  'debugging',
  'functions',
  'classes'
);

CREATE TABLE tutor_room.session (
  id           SERIAL PRIMARY KEY,
  student_id   INTEGER NOT NULL REFERENCES tutor_room.student (id),
  course_id    INTEGER NOT NULL REFERENCES tutor_room.course (id),
  reason       tutor_room.session_reason,
  tutor_id     INTEGER REFERENCES tutor_room_private.tutor (id),
  time_in      TIMESTAMPTZ DEFAULT now(), -- Time the student queues up for help
  time_claimed TIMESTAMPTZ, -- Time the tutor claims the student
  time_out     TIMESTAMPTZ, -- Time the student leaves
  description  TEXT,
  tutor_tag    tutor_room.session_tag,
  tutor_notes  TEXT,
  requeued     BOOLEAN DEFAULT FALSE NOT NULL
);

-- CREATE VIEW tutor_room.student_course AS
--   SELECT *
--   FROM tutor_room.course
--     NATURAL JOIN tutor_room.class
--     NATURAL JOIN tutor_room.student_class
--     JOIN tutor_room.student ON student.id = student_class.student_id;

COMMIT;
