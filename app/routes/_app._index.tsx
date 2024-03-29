import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import { MetaFunction } from "@remix-run/node";
import { Link, useOutletContext } from "@remix-run/react";
import { IconMessagePlus } from "@tabler/icons-react";
import CreateConversation from "~/components/create-conversation";
import MyProfile from "~/components/my-profile";
import { OutletContext } from "~/types";
import { cn } from "~/utils/cn";

export const meta: MetaFunction = () => [{ title: "Chats" }];

export default function IndexPage() {
  const { conversations, session } = useOutletContext<OutletContext>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col items-start gap-3 p-3 lg:flex-row">
      <div className="flex h-fit w-full flex-col items-center gap-2 rounded-3xl border border-default-200 bg-default-50 p-5 lg:w-fit">
        <MyProfile />
        <h2 className="font-medium">{session.user.user_metadata.full_name}</h2>
        <p>{session.user.email}</p>
      </div>
      {conversations.length !== 0 ? (
        <div className="flex h-fit w-full flex-1 flex-col gap-3 rounded-3xl border border-default-200 bg-default-50 p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Chats</h1>
            <Button isIconOnly onPress={onOpen} variant="flat">
              <IconMessagePlus />
            </Button>
          </div>
          <ul className="flex flex-col gap-3">
            {conversations.map((chat) => {
              // Exclude the current user from the profiles
              const excluded = chat.profiles.filter(
                (profile) => profile.id !== session.user.id,
              );
              if (excluded.length === 1) {
                return (
                  <li key={excluded[0].id}>
                    <Link
                      to={`/c/${chat.id}`}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-default-200 hover:bg-default-100",
                      )}
                    >
                      <Avatar
                        src={excluded[0].avatar_url}
                        name={excluded[0].full_name}
                        alt={`Avatar of ${excluded[0].full_name}`}
                      />
                      <div>
                        <h3 className="text-sm font-medium">
                          {excluded[0].full_name}
                        </h3>
                        <p className="text-sm text-default-500">
                          {excluded[0].email}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      ) : (
        <div className="grid w-full place-items-center self-stretch">
          <div className="flex flex-col items-center gap-3">
            <IconMessagePlus size={50} />
            <Button onPress={onOpen} color="primary">
              Add Conversation
            </Button>
          </div>
        </div>
      )}
      <CreateConversation
        onOpen={onOpen}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
