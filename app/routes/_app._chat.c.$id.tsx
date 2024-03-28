import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  redirect,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { Chat } from "~/components/chat";
import CreateMessage from "~/components/create-message";
import Header from "~/components/header";
import { Table } from "~/constants/supabase";
import { Conversation, Message, OutletContext } from "~/types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const conversationId = params.id as string;

  const { message, recipient_id } = Object.fromEntries(
    await request.formData(),
  );

  if ((message as string).length === 0) {
    console.log("No message");
    return json(null, { headers: response.headers });
  }

  const result = await supabase.from("messages").insert({
    content: String(message),
    conversation_id: conversationId,
    recipient_id,
  });

  if (result.error) {
    return redirect("/error", { headers: response.headers });
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
          avatar_url
        )
    `,
    )
    .filter("id", "eq", conversationId)
    .single();

  if (conversation.error) {
    return redirect("/not-found", { headers: response.headers });
  }

  const messages = await supabase
    .from(Table.Messages)
    .select("*")
    .filter("conversation_id", "eq", conversationId)
    .limit(100);

  return json({
    metadata: conversation.data?.profiles,
    messages: messages.data,
    id: conversationId,
  });
};

export default function Index() {
  const { messages, metadata, id } = useLoaderData<typeof loader>();
  const { session } = useOutletContext<OutletContext>();

  const recipientId = (metadata as Conversation["profiles"])?.filter(
    (profile) => profile.id !== session.user.id,
  )[0].id;

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header profiles={metadata as Conversation["profiles"]} />
      <Chat key={id} messages={messages as Message[]} />
      <CreateMessage recipientId={recipientId} />
    </div>
  );
}
