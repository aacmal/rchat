import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
} from "@nextui-org/react";
import { useOutletContext } from "@remix-run/react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import useTheme from "~/hooks/use-theme";
import { OutletContext } from "~/types";

export default function MyProfile() {
  const { session, supabase } = useOutletContext<OutletContext>();
  const { theme, setTheme } = useTheme();

  const { full_name, avatar_url } = session.user.user_metadata;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Dropdown closeOnSelect={false} placement="bottom">
      <DropdownTrigger>
        <Avatar
          isBordered
          src={avatar_url}
          name={full_name}
          alt={`Avatar of ${full_name}`}
          className="mx-auto"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{session.user.email}</p>
        </DropdownItem>
        <DropdownItem key="settings">Change name</DropdownItem>
        <DropdownItem key="dark-mode">
          <div className="flex items-center justify-between">
            Dark Mode
            <Switch
              checked={theme === "dark"}
              onChange={() => {
                theme === "dark" ? setTheme.light() : setTheme.dark();
              }}
              size="sm"
              color="success"
              startContent={<IconSun />}
              endContent={<IconMoon />}
            />
          </div>
        </DropdownItem>
        <DropdownItem onPress={handleLogout} key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
