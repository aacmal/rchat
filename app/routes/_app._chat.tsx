import { Outlet, useOutletContext } from "@remix-run/react";
import Sidebar from "~/components/sidebar";
import { OutletContext } from "~/types";

export default function ChatLayout() {
  const ctx = useOutletContext<OutletContext>();

  return (
    <div className="flex gap-3 px-3">
      <Sidebar />
      <div className="flex-1">
        <Outlet context={ctx} />
      </div>
    </div>
  );
}
