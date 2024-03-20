import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useOutletContext } from "@remix-run/react";
import { OutletContext } from "~/types";

export default function Header() {
  const { supabase } = useOutletContext<OutletContext>();

  return (
    <header className="sticky top-0 bg-background pt-3 shadow-2xl shadow-background/50">
      <div className="flex items-center justify-between rounded-lg border border-default-100 bg-default-50 px-4 py-3">
        <h1 className="text-lg font-semibold">Chat With Angga</h1>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem
              onClick={() => supabase.auth.signOut()}
              key="logout"
              color="danger"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
