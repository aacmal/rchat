import { Avatar } from "@nextui-org/react";
import { useOutletContext } from "@remix-run/react";
import { OutletContext } from "~/types";

interface Props {
  topic?: string;
  profiles: {
    id: string;
    full_name: string;
    photo_url: string;
  }[];
}
export default function Header(props: Props) {
  return (
    <header className="sticky top-0 bg-background pt-3 shadow-2xl shadow-background/50">
      <div className="flex items-center justify-between rounded-lg border border-default-100 bg-default-50 px-4 py-3">
        {!props.topic && <PrivateChat profiles={props.profiles} />}
      </div>
    </header>
  );
}

function PrivateChat({ profiles }: Pick<Props, "profiles">) {
  const { session } = useOutletContext<OutletContext>();
  // exclude the current user
  const otherProfiles = profiles?.filter(
    (profile) => profile.id !== session.user.id,
  )[0];

  return (
    <>
      <title>Chat With {otherProfiles?.full_name}</title>
      <h1 className="text-lg font-semibold">
        Chat With {otherProfiles?.full_name}
      </h1>
      <Avatar
        isBordered
        size="md"
        name={otherProfiles?.full_name}
        src={otherProfiles?.photo_url}
      />
    </>
  );
}
