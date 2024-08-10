DROP TABLE IF EXISTS "public"."conversations";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."conversations" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."messages";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."messages" (
    "id" int8 NOT NULL,
    "sender_id" uuid DEFAULT auth.uid(),
    "content" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "conversation_id" uuid,
    "recipient_id" uuid NOT NULL,
    CONSTRAINT "public_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE,
    CONSTRAINT "public_messages_sender_d_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
);


-- Indices
CREATE UNIQUE INDEX private_messages_pkey ON public.messages USING btree (id);

DROP TABLE IF EXISTS "public"."profiles";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "updated_at" timestamptz,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "website" text,
    "email" text,
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
);


-- Indices
CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

DROP TABLE IF EXISTS "public"."user_to_conversation";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."user_to_conversation" (
    "user_id" uuid NOT NULL,
    "conversation_id" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "public_user_to_conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id"),
    CONSTRAINT "user_to_conversation_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id"),
    PRIMARY KEY ("user_id","conversation_id")
);

CREATE OR REPLACE FUNCTION public.create_conversation(participant1 uuid, participant2 uuid)
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
AS $function$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

INSERT INTO "public"."conversations" ("id", "created_at") VALUES
('9612bf9b-913d-418d-b9ec-558d26674101', '2024-03-29 14:36:12.828058+00');
INSERT INTO "public"."conversations" ("id", "created_at") VALUES
('797827e2-c028-4193-841e-cb19574a296d', '2024-03-30 09:53:44.324147+00');
INSERT INTO "public"."conversations" ("id", "created_at") VALUES
('4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '2024-03-31 10:38:37.576588+00');

INSERT INTO "public"."messages" ("id", "sender_id", "content", "created_at", "conversation_id", "recipient_id") VALUES
(4, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Hello', '2024-03-30 02:12:03.740568+00', '9612bf9b-913d-418d-b9ec-558d26674101', '4fdff0ef-dfdd-4f24-b59c-def47d49634b');
INSERT INTO "public"."messages" ("id", "sender_id", "content", "created_at", "conversation_id", "recipient_id") VALUES
(5, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'ss', '2024-03-30 02:12:35.514071+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3');
INSERT INTO "public"."messages" ("id", "sender_id", "content", "created_at", "conversation_id", "recipient_id") VALUES
(6, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Jj', '2024-03-30 02:14:10.717195+00', '9612bf9b-913d-418d-b9ec-558d26674101', '4fdff0ef-dfdd-4f24-b59c-def47d49634b');
INSERT INTO "public"."messages" ("id", "sender_id", "content", "created_at", "conversation_id", "recipient_id") VALUES
(7, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Apaan dah', '2024-03-30 02:15:46.945342+00', '9612bf9b-913d-418d-b9ec-558d26674101', '4fdff0ef-dfdd-4f24-b59c-def47d49634b'),
(8, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'What if?', '2024-03-30 06:43:23.220856+00', '9612bf9b-913d-418d-b9ec-558d26674101', '4fdff0ef-dfdd-4f24-b59c-def47d49634b'),
(9, '4541d36c-5010-4761-9401-3b8155187d3c', 'Jjshdu', '2024-03-30 09:54:01.5017+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(10, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hhsjs', '2024-03-30 09:54:17.099123+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(11, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hhhhh', '2024-03-30 09:54:26.830954+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3');
INSERT INTO "public"."messages" ("id", "sender_id", "content", "created_at", "conversation_id", "recipient_id") VALUES
(12, '4541d36c-5010-4761-9401-3b8155187d3c', 'Ghhhhttjj', '2024-03-30 09:54:38.802306+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(13, '4541d36c-5010-4761-9401-3b8155187d3c', 'Uj', '2024-03-30 09:54:48.084062+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(14, '4541d36c-5010-4761-9401-3b8155187d3c', 'Icff', '2024-03-30 09:55:04.076757+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(15, '4541d36c-5010-4761-9401-3b8155187d3c', 'Rree', '2024-03-30 09:55:21.738992+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(16, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hshah', '2024-03-30 09:55:27.288385+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(17, '4541d36c-5010-4761-9401-3b8155187d3c', 'Jsjs', '2024-03-30 09:55:30.559329+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(18, '4541d36c-5010-4761-9401-3b8155187d3c', 'Dhsh', '2024-03-30 09:55:33.54749+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(19, '4541d36c-5010-4761-9401-3b8155187d3c', 'Yyyuyy', '2024-03-30 09:55:43.337036+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(20, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hhhh', '2024-03-30 09:55:48.754645+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(21, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hh', '2024-03-30 09:55:51.094744+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(22, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hhhhh', '2024-03-30 09:55:55.007561+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(23, '4541d36c-5010-4761-9401-3b8155187d3c', 'Yhhh', '2024-03-30 09:55:56.975843+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(24, '4541d36c-5010-4761-9401-3b8155187d3c', 'Yy', '2024-03-30 09:55:58.522554+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(25, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hh', '2024-03-30 09:56:00.150673+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(26, '4541d36c-5010-4761-9401-3b8155187d3c', 'Uu', '2024-03-30 09:56:01.928908+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(27, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hhhh', '2024-03-30 09:56:05.741769+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(28, '4541d36c-5010-4761-9401-3b8155187d3c', 'Hhrue', '2024-03-30 09:56:17.199929+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(29, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Engke duie atuh', '2024-03-30 10:06:05.193501+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(30, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'asd', '2024-03-30 10:29:34.467886+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(31, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'asd', '2024-03-30 10:42:22.228698+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(32, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 's', '2024-03-30 10:42:23.271433+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(33, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'sd', '2024-03-30 10:43:57.793253+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(34, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'asd', '2024-03-30 10:44:02.05267+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(35, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 's', '2024-03-30 10:44:02.983684+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(36, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 's', '2024-03-30 10:44:03.875082+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(37, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'd', '2024-03-30 10:44:04.644749+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(38, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 's', '2024-03-30 10:44:22.880943+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(39, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'd', '2024-03-30 10:44:23.700739+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(40, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'd', '2024-03-30 10:44:26.186268+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(41, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'w', '2024-03-30 10:44:27.140026+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(42, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 's', '2024-03-30 10:44:28.078063+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(43, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 's', '2024-03-30 10:44:34.95913+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(44, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 'd', '2024-03-30 10:44:36.46571+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(45, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', '1', '2024-03-30 10:44:47.675682+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(46, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', '2', '2024-03-30 10:44:48.654788+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(47, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', '3', '2024-03-30 10:44:49.527384+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(48, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', '4', '2024-03-30 10:44:50.623092+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(49, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', '1', '2024-03-30 10:44:51.728751+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(50, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 's', '2024-03-30 10:44:56.923254+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3');
INSERT INTO "public"."messages" ("id", "sender_id", "content", "created_at", "conversation_id", "recipient_id") VALUES
(51, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', 's', '2024-03-30 10:45:06.754673+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3');
INSERT INTO "public"."messages" ("id", "sender_id", "content", "created_at", "conversation_id", "recipient_id") VALUES
(52, '4fdff0ef-dfdd-4f24-b59c-def47d49634b', '1', '2024-03-30 10:45:08.309646+00', '9612bf9b-913d-418d-b9ec-558d26674101', 'cab3e328-f64e-4239-a78a-9146e875d4f3');
INSERT INTO "public"."messages" ("id", "sender_id", "content", "created_at", "conversation_id", "recipient_id") VALUES
(53, '4541d36c-5010-4761-9401-3b8155187d3c', 'H', '2024-03-30 14:21:26.51052+00', '797827e2-c028-4193-841e-cb19574a296d', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(54, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Hehe', '2024-03-30 14:24:02.193576+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(55, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Haha', '2024-03-30 14:24:10.600909+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(56, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Gs', '2024-03-30 14:24:16.631156+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(57, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Hhhj', '2024-03-30 14:24:21.552499+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(58, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Heh', '2024-03-30 14:24:27.003106+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(59, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Pp', '2024-03-30 14:24:30.573545+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(60, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'K', '2024-03-30 14:24:32.972464+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(61, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'P', '2024-03-30 22:18:10.55938+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(62, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Halo', '2024-03-30 22:18:17.456712+00', '797827e2-c028-4193-841e-cb19574a296d', '4541d36c-5010-4761-9401-3b8155187d3c'),
(63, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Oi ri', '2024-03-31 10:38:43.617419+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(64, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Test', '2024-03-31 13:05:55.71835+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(65, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Oi', '2024-04-02 10:51:19.614125+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(66, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Indikator online lg on going', '2024-04-02 10:51:56.717668+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(67, '0f9b89f8-5969-4eef-9fbd-448b3e20da5f', 'test', '2024-04-02 10:52:48.559269+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(68, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Gk punya haridyer', '2024-04-02 10:52:58.923458+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(69, '0f9b89f8-5969-4eef-9fbd-448b3e20da5f', 'ada hairdryer gak', '2024-04-02 10:53:01.809431+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(70, '0f9b89f8-5969-4eef-9fbd-448b3e20da5f', 'hmm ok deh', '2024-04-02 10:53:08.906894+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(71, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Buat apa emng?', '2024-04-02 10:53:09.828109+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(72, '0f9b89f8-5969-4eef-9fbd-448b3e20da5f', 'pasang garskin', '2024-04-02 10:53:17.182694+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(73, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Pake fan pc aje', '2024-04-02 10:53:24.826445+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(74, '0f9b89f8-5969-4eef-9fbd-448b3e20da5f', 'btw ini chat kayak wa ya?', '2024-04-02 10:53:28.939953+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(75, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Yoi', '2024-04-02 10:53:35.859901+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(76, '0f9b89f8-5969-4eef-9fbd-448b3e20da5f', 'mana panas', '2024-04-02 10:53:37.411785+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', 'cab3e328-f64e-4239-a78a-9146e875d4f3'),
(77, 'cab3e328-f64e-4239-a78a-9146e875d4f3', 'Coba klik icon call ri', '2024-04-02 10:53:43.74771+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '0f9b89f8-5969-4eef-9fbd-448b3e20da5f'),
(78, '0f9b89f8-5969-4eef-9fbd-448b3e20da5f', 'tpi gk bisa ngemention pesan sebelumnya', '2024-04-02 10:53:52.648628+00', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', 'cab3e328-f64e-4239-a78a-9146e875d4f3');

INSERT INTO "public"."profiles" ("id", "updated_at", "username", "full_name", "avatar_url", "website", "email") VALUES
('cab3e328-f64e-4239-a78a-9146e875d4f3', NULL, NULL, 'Aca Maulana', 'https://lh3.googleusercontent.com/a/ACg8ocIQTT2zf0HKYLH6zXKm4ildAs8KEiSj0QMfYO_ilXSakUY=s96-c', NULL, 'acamaulana123@gmail.com');
INSERT INTO "public"."profiles" ("id", "updated_at", "username", "full_name", "avatar_url", "website", "email") VALUES
('4fdff0ef-dfdd-4f24-b59c-def47d49634b', NULL, NULL, 'Aca Maulana', 'https://lh3.googleusercontent.com/a/ACg8ocLSWZVygjdTfSZHdREx9XmQ_mlG_L8PY47tnMDqyxQD=s96-c', NULL, 'acamaulana.9b@gmail.com');
INSERT INTO "public"."profiles" ("id", "updated_at", "username", "full_name", "avatar_url", "website", "email") VALUES
('4541d36c-5010-4761-9401-3b8155187d3c', NULL, NULL, 'Aca Maulana', 'https://lh3.googleusercontent.com/a/ACg8ocIXgG7v_chY0KqIYpbpXW6k8AdqdDPDOTELgWjM4Nhi=s96-c', NULL, 'acaherumaulana@gmail.com');
INSERT INTO "public"."profiles" ("id", "updated_at", "username", "full_name", "avatar_url", "website", "email") VALUES
('0f9b89f8-5969-4eef-9fbd-448b3e20da5f', NULL, NULL, 'Fahri 05', 'https://lh3.googleusercontent.com/a/ACg8ocJY8RU1L5LD76JrKEk7GuS0sDjDDQjmW2-ttVldfXi--Ic=s96-c', NULL, 'fahriluqman0586@gmail.com'),
('4064ffc7-3c11-44fc-b689-dffd0188efee', NULL, NULL, 'Himan Yusuf', 'https://lh3.googleusercontent.com/a/ACg8ocKNuHGIJUUukrJ1YWiBozzs0YfAe_GLBGwW_hmtwLh6ry1Mjw=s96-c', NULL, 'himanyusuf007@gmail.com'),
('a8f8eacf-8fe0-47bd-bcc6-2f094af8cf64', NULL, NULL, 'k tham33n', 'https://lh3.googleusercontent.com/a/ACg8ocLdclTodPpScAm-gHDGvU2DIrMR9Z6KEL_a0me2EpsJM150Yg=s96-c', NULL, 'ktham33n@gmail.com');

INSERT INTO "public"."user_to_conversation" ("user_id", "conversation_id", "created_at") VALUES
('4fdff0ef-dfdd-4f24-b59c-def47d49634b', '9612bf9b-913d-418d-b9ec-558d26674101', '2024-03-29 14:36:12.828058+00');
INSERT INTO "public"."user_to_conversation" ("user_id", "conversation_id", "created_at") VALUES
('cab3e328-f64e-4239-a78a-9146e875d4f3', '9612bf9b-913d-418d-b9ec-558d26674101', '2024-03-29 14:36:12.828058+00');
INSERT INTO "public"."user_to_conversation" ("user_id", "conversation_id", "created_at") VALUES
('4541d36c-5010-4761-9401-3b8155187d3c', '797827e2-c028-4193-841e-cb19574a296d', '2024-03-30 09:53:44.324147+00');
INSERT INTO "public"."user_to_conversation" ("user_id", "conversation_id", "created_at") VALUES
('cab3e328-f64e-4239-a78a-9146e875d4f3', '797827e2-c028-4193-841e-cb19574a296d', '2024-03-30 09:53:44.324147+00'),
('cab3e328-f64e-4239-a78a-9146e875d4f3', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '2024-03-31 10:38:37.576588+00'),
('0f9b89f8-5969-4eef-9fbd-448b3e20da5f', '4473b22e-f1a9-4a50-b57d-cf809d9c39ed', '2024-03-31 10:38:37.576588+00');


