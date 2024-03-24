import { Avatar, Button } from "@nextui-org/react";
import { MetaFunction } from "@remix-run/node";
import { Link, useOutletContext } from "@remix-run/react";
import { OutletContext } from "~/types";
import { cn } from "~/utils/cn";

export const meta: MetaFunction = () => [{ title: "Chats" }];

export default function IndexPage() {
  const { conversations, session, supabase } =
    useOutletContext<OutletContext>();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col justify-center gap-3 p-3 lg:flex-row">
      <div className="flex h-fit flex-col items-center gap-2 rounded-3xl border border-default-200 bg-default-50 p-5">
        <Avatar
          src={session.user.user_metadata.avatar_url}
          name={session.user.user_metadata.full_name}
          alt={`Avatar of ${session.user.user_metadata.full_name}`}
        />
        <h2 className="font-medium">{session.user.user_metadata.full_name}</h2>
        <p>{session.user.email}</p>
        <Button
          onPress={handleLogout}
          color="danger"
          variant="flat"
          radius="sm"
          className="w-full"
        >
          Log Out
        </Button>
      </div>
      <div className="flex h-fit flex-1 flex-col gap-3 rounded-3xl border border-default-200 bg-default-50 p-3 lg:p-5">
        <h1 className="text-xl font-bold">Chats</h1>
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
                      src={excluded[0].photo_url}
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
    </div>
  );
}
