INSERT INTO
  tutor_room.course (course_number, name)
VALUES
  ('1400', 'Introduction to Computer Science - CS1'),
  ('1410', 'Introduction to Computer Science - CS2'),
  ('1440', 'Methods in Computer Science');

INSERT INTO
  tutor_room.class (crn, course_number, instructor)
VALUES
  ('10925', '1400', 'Jacob Christiansen'),
  ('12986', '1400', 'Apoorva Chauhan'),
  ('10937', '1410', 'James Mathias'),
  ('14472', '1440', 'Stephen Clyde');
