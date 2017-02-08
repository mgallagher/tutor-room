-- Student's full name
CREATE FUNCTION tutor_room.students_full_name(student tutor_room.students)
  RETURNS TEXT AS $$
SELECT student.first_name || ' ' || student.last_name
$$ LANGUAGE SQL STABLE;
