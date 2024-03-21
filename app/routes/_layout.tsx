import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import Sidebar from "~/components/sidebar";
import { Conversation, OutletContext } from "~/types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { participant1, participant2 } = Object.fromEntries(
    await request.formData(),
  );

  await supabase.rpc("create_conversation", {
    participant1: String(participant1),
    participant2: String(participant2),
  });

  return json(null, { headers: response.headers });
};

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
  const { supabase, session } = useOutletContext<OutletContext>();
  const { conversations } = useLoaderData<typeof loader>();

  return (
    <div className="flex gap-3 px-3">
      <Sidebar currentSession={session} data={conversations} />
      <div className="flex-1">
        <Outlet
          context={{
            supabase,
            session,
            conversations,
          }}
        />
      </div>
    </div>
  );
}
