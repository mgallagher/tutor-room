-- User's full name
CREATE FUNCTION tutor_app.users_full_name(some_user tutor_app.users)
  RETURNS TEXT AS $$
SELECT some_user.first_name || ' ' || some_user.last_name
$$ LANGUAGE SQL STABLE;
