import { ActionFunctionArgs, json } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import Sidebar from "~/components/sidebar";
import { OutletContext } from "~/types";
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

export default function ChatLayout() {
  const ctx = useOutletContext<OutletContext>();

  return (
    <div className="flex gap-3 px-3">
      <Sidebar />
      <div className="flex-1">
        <Outlet context={ctx} />
      </div>
    </div>
  );
}
