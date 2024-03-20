import { Avatar } from "@nextui-org/react";
import { NavLink } from "@remix-run/react";
import { chatList } from "data/dummy";
import { cn } from "~/utils/cn";

// export const loader = async () => {
//   const data = chatList;

//   return json({
//     data,
//   });
// };

export default function ChatList() {
  const { data } = {
    data: chatList,
  };

  return (
    <aside className="sticky top-0 h-screen w-2/6 max-w-xs p-3">
      <div className="h-full w-full rounded-xl border border-default-100 bg-default-50 p-5">
        <h2 className="mb-5 text-lg font-bold">Chats</h2>
        <ul className="space-y-3">
          {data.map((chat) => (
            <li key={chat.id}>
              <NavLink
                className={({ isActive, isPending }) =>
                  cn(
                    "flex w-full items-center gap-3 rounded-lg px-5 py-2 transition-background hover:bg-primary-50",
                    {
                      "bg-primary-50": isActive,
                      "border-primary-100": isPending,
                    },
                  )
                }
                to={`/${chat.id}`}
              >
                <Avatar
                  size="sm"
                  showFallback
                  src={`${chat.photo}/${chat.id}.jpg`}
                  name={chat.name}
                />
                <div>
                  <h3 className="font-medium">{chat.name}</h3>
                  <p className="text-xs">{chat.lastMessage}</p>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
