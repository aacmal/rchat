set check_function_bodies = off;
DROP FUNCTION public.create_conversation(uuid, uuid);
CREATE FUNCTION public.create_conversation(participant1 uuid, participant2 uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    conversationId uuid;
    convIdCheck uuid;
BEGIN
    -- Check if conversation already created
    SELECT conversation_id from user_to_conversation WHERE user_id = participant1
    INTERSECT
    SELECT conversation_id from user_to_conversation WHERE user_id = participant2
    INTO convIdCheck;

    IF convIdCheck IS NULL THEN
        -- Insert new row the "conversations" table
        INSERT INTO conversations DEFAULT VALUES
        RETURNING id INTO conversationId;

        -- Insert a new participant into the "user_to_conversation" AKA junction table
        INSERT INTO user_to_conversation (conversation_id, user_id)
        VALUES (conversationId, participant1);

        INSERT INTO user_to_conversation (conversation_id, user_id)
        VALUES (conversationId, participant2);
    END IF;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;$function$
;


