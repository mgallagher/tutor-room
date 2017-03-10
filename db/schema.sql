BEGIN;

CREATE SCHEMA tutor_room;
CREATE SCHEMA tutor_room_private;

-- Any particularly sensitive data should live in the private schema
CREATE TABLE tutor_room_private.tutor (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE CHECK (email ~* '^.+@.+\..+$'),
  password_hash TEXT NOT NULL
);

CREATE TABLE tutor_room.student (
  id         SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name  TEXT,
  a_number   TEXT NOT NULL UNIQUE, -- Add a check or domain here, possibly move to private schema
  created    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tutor_room.course (
  course_number INTEGER PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE
);

CREATE TABLE tutor_room.class (
  crn           INTEGER PRIMARY KEY,
  course_number INTEGER NOT NULL REFERENCES tutor_room.course (course_number) ON DELETE CASCADE,
  instructor    TEXT    NOT NULL
);

CREATE TABLE tutor_room.student_class (
  student_id INTEGER NOT NULL REFERENCES tutor_room.student (id),
  crn  INTEGER NOT NULL REFERENCES tutor_room.class (crn),
  PRIMARY KEY (student_id, crn)
);

CREATE TYPE tutor_room.tutoring_reason AS ENUM (
  'debugging',
  'syntax',
  'concept',
  'program_design'
);

CREATE TABLE tutor_room.visit (
  id           SERIAL PRIMARY KEY,
  student_id   INTEGER NOT NULL REFERENCES tutor_room.student (id),
  crn          INTEGER NOT NULL REFERENCES tutor_room.class (crn),
  reason       tutor_room.tutoring_reason,
  tutor_id     INTEGER REFERENCES tutor_room_private.tutor (id),
  time_in      TIMESTAMPTZ DEFAULT now(), -- Time the student queues up for help
  time_claimed TIMESTAMPTZ, -- Time the tutor claims the student
  time_out     TIMESTAMPTZ, -- Time the student leaves
  description  TEXT
);

CREATE VIEW tutor_room.student_course AS
  SELECT *
  FROM tutor_room.course
    NATURAL JOIN tutor_room.class
    NATURAL JOIN tutor_room.student_class
    JOIN tutor_room.student ON student.id = student_class.student_id;

COMMIT;
