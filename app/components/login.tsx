import { Button } from "@nextui-org/react";
import type { OutletContext } from "~/types";

export const Login = ({
  supabase,
}: {
  supabase: OutletContext["supabase"];
}) => {
  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Button color="primary" size="lg" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};
