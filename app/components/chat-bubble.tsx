import { useOutletContext } from "@remix-run/react";
import type { Message, OutletContext } from "~/types";
import { cn } from "~/utils/cn";

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { session } = useOutletContext<OutletContext>();

  const isCurrentUser = session.user.id === message.sender;

  return (
    <div
      className={cn("flex w-full", {
        "justify-end": isCurrentUser,
      })}
    >
      <div
        className={cn(
          "max-w-2/3 rounded-full p-3 font-medium",
          {
            "bg-default-50": !isCurrentUser,
            "bg-gradient-to-b from-primary-400 to-primary-500 text-foreground-50":
              isCurrentUser,
          },
          "text-sm",
        )}
      >
        {message.content}
      </div>
    </div>
  );
};
