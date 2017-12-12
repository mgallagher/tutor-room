create role tutor;
create role student;
create role unauthenticated;

grant usage on schema tutor_room to tutor, student, unauthenticated;
grant usage on schema tutor_room_private to tutor;
grant select on table tutor_room.session to tutor, student, unauthenticated;
grant select on table tutor_room.tutor to tutor, student;
grant select on table tutor_room.student to tutor, student;
grant select on table tutor_room.course to tutor, student;
grant select on table tutor_room.student_course to tutor, student;
grant insert, update on table tutor_room.session to tutor, student;
grant delete on table tutor_room.session to tutor;
grant execute on function tutor_room.latest_average_wait() to tutor, student, unauthenticated;
grant all privileges on all sequences in schema tutor_room, tutor_room_private to tutor, student;
