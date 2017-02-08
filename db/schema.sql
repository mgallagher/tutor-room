BEGIN;

CREATE SCHEMA tutor_room;
CREATE SCHEMA tutor_room_private;

-- Any particularly sensitive data should live in the private schema
CREATE TABLE tutor_room_private.tutors (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE CHECK (email ~* '^.+@.+\..+$'),
  password_hash TEXT NOT NULL
);

CREATE TABLE tutor_room.students (
  id         SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name  TEXT,
  a_number   TEXT NOT NULL UNIQUE, -- Add a check or domain here, possibly move to private schema
  created    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tutor_room.courses (
  course_number INTEGER PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE
);

CREATE TABLE tutor_room.classes (
  crn           INTEGER PRIMARY KEY,
  course_number INTEGER NOT NULL REFERENCES tutor_room.courses (course_number) ON DELETE CASCADE,
  instructor    TEXT    NOT NULL
);

CREATE TABLE tutor_room.student_classes (
  student_id INTEGER NOT NULL REFERENCES tutor_room.students (id),
  class_crn  INTEGER NOT NULL REFERENCES tutor_room.classes (crn),
  PRIMARY KEY (student_id, class_crn)
);

CREATE TYPE tutor_room.tutoring_reason AS ENUM (
  'debugging',
  'syntax',
  'concept',
  'program_design'
);

CREATE TABLE tutor_room.visits (
  id           SERIAL PRIMARY KEY,
  student_id   INTEGER NOT NULL REFERENCES tutor_room.students (id),
  class_crn    INTEGER NOT NULL REFERENCES tutor_room.classes (crn),
  reason       tutor_room.tutoring_reason,
  tutor_id     INTEGER REFERENCES tutor_room_private.tutors (id),
  time_in      TIMESTAMPTZ DEFAULT now(), -- Time the student queues up for help
  time_claimed TIMESTAMPTZ, -- Time the tutor claims the student
  time_out     TIMESTAMPTZ, -- Time the student leaves
  description  TEXT
);

COMMIT;
