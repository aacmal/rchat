import "@fontsource-variable/noto-sans-tc";
import { NextUIProvider } from "@nextui-org/react";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { useEffect, useState } from "react";

import { Login } from "./components/login";
import tailwind from "./tailwind.css?url";
import { createSupabaseServerClient } from "./utils/supabase.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_KEY: process.env.SUPABASE_KEY!,
  };

  const response = new Response();

  const supabase = createSupabaseServerClient({ request, response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json({ env, session }, { headers: response.headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_KEY),
  );

  const { revalidate } = useRevalidator();

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        revalidate();
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, serverAccessToken, revalidate]);

  if (!session) {
    return (
      <div className="grid h-screen w-screen place-items-center">
        <Login supabase={supabase} />
      </div>
    );
  }

  return <Outlet context={{ supabase, session }} />;
}
