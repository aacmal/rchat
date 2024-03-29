import { Button } from "@nextui-org/react";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { OutletContext } from "~/types";

interface Props {
  topic?: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
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

  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center gap-2">
        <Button onPress={() => navigate(-1)} isIconOnly variant="light">
          <IconArrowLeft />
        </Button>
        <h1 className="text-sm font-semibold lg:text-lg">
          Chat With {otherProfiles?.full_name}
        </h1>
      </div>
      {/* <Avatar
        isBordered
        size="md"
        name={otherProfiles?.full_name}
        src={otherProfiles?.avatar_url}
      /> */}
    </>
  );
}
