import { useOutletContext } from "@remix-run/react";
import type { Message, OutletContext } from "~/types";
import { cn } from "~/utils/cn";

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { session } = useOutletContext<OutletContext>();

  const isMine = session.user.id === message.user_id;

  return (
    <div
      className={cn("flex", {
        "justify-end": isMine,
      })}
    >
      <div
        className={cn(
          "max-w-2/3 rounded-full p-3",
          {
            "bg-default-50": !isMine,
            "bg-gradient-to-b from-primary-400 to-primary-500 text-foreground-50":
              isMine,
          },
          "text-sm",
        )}
      >
        {message.content}
      </div>
    </div>
  );
};
