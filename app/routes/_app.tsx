import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Conversation, Message, OutletContext } from "~/types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const session = await supabase.auth.getSession();

  const result = await supabase
    .from("profiles")
    .select(
      `
      full_name,
      conversations (
        id,
        profiles (
          id,
          full_name,
          photo_url,
          email
        )
      )
    `,
    )
    .filter("id", "eq", session.data.session?.user.id)
    .single();

  const conversations = result?.data?.conversations ?? [];

  return json(
    {
      conversations: conversations as Conversation[],
    },
    {
      headers: response.headers,
    },
  );
};

export default function MainLayout() {
  const { supabase, session, notificationSoundRef, ...res } =
    useOutletContext<OutletContext>();
  const { conversations } = useLoaderData<typeof loader>();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const channel = supabase
      .channel(session.user.id)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${session.user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (params.id !== newMessage.conversation_id) {
            notificationSoundRef.current?.play();
            toast("New messages", {
              description: newMessage.content,
              dismissible: true,
              action: {
                label: "View",
                onClick: () => navigate(`/c/${newMessage.conversation_id}`),
              },
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  });

  return (
    <Outlet
      context={{
        ...res,
        supabase,
        session,
        notificationSoundRef,
        conversations,
      }}
    />
  );
}
