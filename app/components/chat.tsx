import { useOutletContext, useParams } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import type { Message, OutletContext } from "~/types";

import { ChatBubble } from "./chat-bubble";

interface ChatProps {
  messages: Message[];
}

export const Chat = ({ messages: serverMessages }: ChatProps) => {
  const [messages, setMessages] = useState(serverMessages);
  const { supabase } = useOutletContext<OutletContext>();
  const params = useParams();

  const scrollToEnd = useCallback(() => {
    // disable the scroll if the user has scrolled up
    setTimeout(() => {
      if (
        window.scrollY + window.innerHeight <
        window.document.body.scrollHeight
      ) {
        // workaround for the scroll not working
        window.scrollTo({
          top: window.document.body.scrollHeight + 1000,
          behavior: "smooth",
        });
      }
    }, 100);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${params.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage]);
            scrollToEnd();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, supabase]);

  useEffect(() => {
    scrollToEnd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-1 flex-col justify-end pt-10">
      <div className="flex flex-1 flex-col items-end gap-3">
        {messages.map((message) => (
          <ChatBubble message={message} key={message.id} />
        ))}
      </div>
    </div>
  );
};
