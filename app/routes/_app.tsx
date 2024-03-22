import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { Conversation, OutletContext } from "~/types";
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
  const { supabase, session } = useOutletContext<OutletContext>();
  const { conversations } = useLoaderData<typeof loader>();

  return (
    <Outlet
      context={{
        supabase,
        session,
        conversations,
      }}
    />
  );
}
