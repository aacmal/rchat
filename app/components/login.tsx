import { Button } from "@nextui-org/react";
import { useOutletContext } from "@remix-run/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import type { OutletContext } from "~/types";

export const Login = ({
  supabase,
}: {
  supabase: OutletContext["supabase"];
}) => {
  const { appURL } = useOutletContext<OutletContext>();

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: appURL,
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
