import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Chats" }];

export default function Index() {
  return (
    <div className="grid min-h-screen w-full place-items-center">
      <h2>Select Conversation</h2>
    </div>
  );
}
