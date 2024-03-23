import { useOutletContext } from "@remix-run/react";
import type { Message, OutletContext } from "~/types";
import { cn } from "~/utils/cn";

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { session } = useOutletContext<OutletContext>();

  const isCurrentUser = session.user.id === message.sender_id;

  return (
    <div
      className={cn("flex w-full", {
        "justify-end": isCurrentUser,
      })}
    >
      <div
        className={cn("flex w-full flex-col gap-1", {
          "items-end": isCurrentUser,
        })}
      >
        <span className="text-xs text-default-600">
          {new Date(message.created_at).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </span>
        <div
          className={cn(
            "w-fit max-w-[70%] rounded-3xl border p-3 font-medium md:max-w-[60%]",
            {
              "border-default-200 bg-default-100": !isCurrentUser,
              "border-transparent bg-gradient-to-b from-primary-400 to-primary-500 text-foreground-50":
                isCurrentUser,
            },
            "text-sm",
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};
