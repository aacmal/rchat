import { Button } from "@nextui-org/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import type { OutletContext } from "~/types";

export const Login = ({
  supabase,
}: {
  supabase: OutletContext["supabase"];
}) => {
  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://rchat.acml.me/",
      },
    });
  };

  return (
    <div className="rounded-xl p-7 shadow-2xl shadow-primary-500/30">
      <Button color="primary" size="lg" onPress={handleLogin}>
        <IconBrandGoogle />
        Login with Google
      </Button>
    </div>
  );
};
