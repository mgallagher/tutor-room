BEGIN;

CREATE SCHEMA tutor_app;
CREATE SCHEMA tutor_app_private;

CREATE TABLE tutor_app.users (
  id         SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name  TEXT,
  a_number   TEXT NOT NULL UNIQUE, -- Add a check or domain here, possibly move to private schema
  created    TIMESTAMPTZ DEFAULT now()
);

-- Any particularly sensitive data should live in the private schema
CREATE TABLE tutor_app_private.users (
  user_id       INTEGER PRIMARY KEY REFERENCES tutor_app.users (id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE CHECK (email ~* '^.+@.+\..+$'),
  password_hash TEXT NOT NULL
);

CREATE TABLE tutor_app.courses (
  course_number INTEGER PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE
);

CREATE TABLE tutor_app.classes (
  crn           INTEGER PRIMARY KEY,
  course_number INTEGER NOT NULL REFERENCES tutor_app.courses (course_number) ON DELETE CASCADE,
  instructor    TEXT NOT NULL
);

CREATE TABLE tutor_app.student_courses (
  student_id INTEGER NOT NULL REFERENCES tutor_app.users (id),
  class_crn INTEGER NOT NULL REFERENCES tutor_app.classes (crn),
  UNIQUE (student_id, class_crn)
);

CREATE TYPE tutor_app.tutoring_reason AS ENUM (
  'debugging',
  'syntax',
  'concept',
  'program_design'
);

CREATE TABLE tutor_app.visits (
  id           SERIAL PRIMARY KEY,
  student_id   INTEGER NOT NULL REFERENCES tutor_app.users (id),
  class_crn    INTEGER NOT NULL REFERENCES tutor_app.classes (crn),
  reason       tutor_app.tutoring_reason,
  tutor_id     INTEGER REFERENCES tutor_app.users (id),
  time_in      TIMESTAMPTZ DEFAULT now(), -- Time the student queues up for help
  time_claimed TIMESTAMPTZ, -- Time the tutor claims the student
  time_out     TIMESTAMPTZ, -- Time the student leaves
  feedback     TEXT
);

COMMIT;
