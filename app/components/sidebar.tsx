import { Avatar, Button, Divider, useDisclosure } from "@nextui-org/react";
import { NavLink, useOutletContext } from "@remix-run/react";
import { IconMessagePlus } from "@tabler/icons-react";
import { OutletContext } from "~/types";
import { cn } from "~/utils/cn";

import CreateConversation from "./create-conversation";
import MyProfile from "./my-profile";

export default function Sidebar() {
  const { conversations } = useOutletContext<OutletContext>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { session } = useOutletContext<OutletContext>();

  return (
    <aside className="sticky top-0 hidden h-screen w-fit max-w-xs py-3 md:block lg:w-2/6">
      <div className="flex h-full w-fit flex-col items-center rounded-xl border border-default-100 bg-default-50 p-3 lg:w-full lg:items-stretch lg:p-5">
        <MyProfile />
        <Divider className="my-6" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="hidden text-lg font-bold lg:inline">Chats</h2>
          <Button onPress={onOpen} variant="flat" isIconOnly>
            <IconMessagePlus />
          </Button>
          <CreateConversation
            onOpen={onOpen}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </div>
        <ul className="space-y-3">
          {conversations?.length === 0 ? (
            <li className="text-sm">You doesn&apos;s have conversation yet</li>
          ) : (
            conversations?.map((contact) => {
              // Exclude the current user from the profiles
              const excluded = contact.profiles.filter(
                (profile) => profile.id !== session.user.id,
              );
              if (excluded.length === 1) {
                return (
                  <li key={excluded[0].id}>
                    <NavLink
                      to={`/c/${contact.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex w-fit items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-default-200 hover:bg-default-100 lg:w-full",
                          {
                            "border-default-200 bg-default-100": isActive,
                          },
                        )
                      }
                    >
                      <Avatar
                        src={excluded[0].avatar_url}
                        name={excluded[0].full_name}
                        alt={`Avatar of ${excluded[0].full_name}`}
                      />
                      <div className="hidden lg:block">
                        <h3 className="text-sm font-medium">
                          {excluded[0].full_name}
                        </h3>
                        <p className="text-sm text-default-500">
                          {excluded[0].email}
                        </p>
                      </div>
                    </NavLink>
                  </li>
                );
              }
              return null;
            })
          )}
        </ul>
      </div>
    </aside>
  );
}
