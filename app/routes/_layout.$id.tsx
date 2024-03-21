import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Chat } from "~/components/chat";
import CreateMessage from "~/components/create-message";
import Header from "~/components/header";
import { Table } from "~/constants/supabase";
import { Conversation, Message } from "~/types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const conversationId = params.id as string;

  const { message } = Object.fromEntries(await request.formData());

  if (String(message).length === 0) {
    return json(null, { headers: response.headers });
  }

  try {
    supabase
      .from("messages")
      .insert({ content: String(message), conversation_id: conversationId });
  } catch (error) {
    console.error(error);
  }

  return json(null, { headers: response.headers });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const conversationId = params.id as string;

  const conversation = await supabase
    .from(Table.Conversations)
    .select(
      `
        profiles (
          id,
          full_name,
          photo_url
        )
    `,
    )
    .filter("id", "eq", conversationId)
    .single();

  const messages = await supabase
    .from(Table.Messages)
    .select("*")
    .filter("conversation_id", "eq", conversationId)
    .limit(100);

  return json(
    {
      metadata: conversation.data?.profiles,
      messages: messages.data,
    },
    {
      headers: response.headers,
    },
  );
};

export default function Index() {
  const { messages, metadata } = useLoaderData<typeof loader>();

  return (
    <div className="relative flex min-h-screen flex-col pr-3">
      <Header profiles={metadata as Conversation["profiles"]} />
      <Chat messages={messages as Message[]} />
      <CreateMessage />
    </div>
  );
}
