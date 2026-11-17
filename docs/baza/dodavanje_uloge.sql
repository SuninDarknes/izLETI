DO $$
DECLARE
    user_email TEXT := '[EMAIL]';
    role_name  TEXT := 'Admin'; -- Admin, Owner, User, Organizer, or Guide
    target_user_id INTEGER;
    target_role_id INTEGER;
BEGIN
    SELECT id INTO target_user_id
    FROM users
    WHERE LOWER(email) = LOWER(user_email)
      AND active = TRUE;

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'No active user found for email %', user_email;
    END IF;

    INSERT INTO roles (name)
    VALUES (role_name)
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO target_role_id;

    INSERT INTO userrole (roleid, userid)
    VALUES (target_role_id, target_user_id)
    ON CONFLICT (roleid, userid) DO NOTHING;
END $$;