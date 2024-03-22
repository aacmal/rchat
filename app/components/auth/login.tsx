import { Button } from "@nextui-org/react";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import type { OutletContext } from "~/types";

export const Login = ({
  supabase,
}: {
  supabase: OutletContext["supabase"];
}) => {
  const handleLoginWithGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  const handleLoginWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl p-7 shadow-2xl shadow-primary-500/30">
      <Button color="primary" size="lg" onPress={handleLoginWithGoogle}>
        <IconBrandGoogle />
        Login with Google
      </Button>
      <Button color="primary" size="lg" onPress={handleLoginWithGithub}>
        <IconBrandGithub />
        Login with Github
      </Button>
    </div>
  );
};
