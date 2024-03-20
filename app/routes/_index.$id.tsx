import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Chat } from "~/components/chat";
import CreateMessage from "~/components/create-message";
import Header from "~/components/header";
import MainLayout from "~/layouts/main-layout";
import { Message } from "~/types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  console.log(request);
  const { message } = Object.fromEntries(await request.formData());
  try {
    const a = await supabase
      .from("messages")
      .insert({ content: String(message) });
    console.log(a);
  } catch (error) {
    console.error(error);
  }

  return json(null, { headers: response.headers });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { data } = await supabase.from("messages").select("*");

  return json(
    {
      messages: data ?? [],
    },
    {
      headers: response.headers,
    },
  );
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <div className="relative flex min-h-screen flex-col pr-3">
        <Header />
        <Chat messages={messages as Message[]} />
        <CreateMessage />
      </div>
    </MainLayout>
  );
}
