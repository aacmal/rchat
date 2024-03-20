import ChatList from "~/components/chat-list";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <ChatList />
      <div className="flex-1">{children}</div>
    </div>
  );
}
