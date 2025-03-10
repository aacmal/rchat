import "@fontsource-variable/noto-sans-tc";
import { NextUIProvider } from "@nextui-org/react";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { useEffect, useRef, useState } from "react";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { Login } from "~/components/auth/login";

import { Toaster } from "./components/ui/sonner";
import globalCSS from "./global.css?url";
import { themeSessionResolver } from "./session.server";
import { createSupabaseServerClient } from "./utils/supabase.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalCSS },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_KEY: process.env.SUPABASE_KEY!,
  };

  const { getTheme } = await themeSessionResolver(request);

  const response = new Response();

  const supabase = createSupabaseServerClient({ request, response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json(
    { env, session, theme: getTheme() },
    { headers: response.headers },
  );
};

export const shouldRevalidate = ({
  formAction,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) => {
  if (formAction !== undefined) return false;
  return defaultShouldRevalidate;
};

function MainLayout({ children }: { children: React.ReactNode }) {
  const [theme] = useTheme();
  return (
    <html lang="en" data-theme={theme ?? "light"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta
          name="description"
          content="RChat - Chat with others in real-time"
        />
        <meta name="author" content="Acml" />
        <meta name="og:title" content="RChat - Chat with others" />
        <meta name="og:description" content="Chat with others in real-time" />
        <meta
          name="og:image"
          content="https://rchat.acml.me/rchat-thumbnail.jpg"
        />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
        <meta name="og:url" content="https://rchat.acml.me" />
        <meta name="og:type" content="website" />
        <meta name="og:site_name" content="RChat" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@axcamz" />
        <meta name="twitter:title" content="RChat" />
        <meta
          name="twitter:description"
          content="Chat with others in real-time"
        />
        <meta
          name="twitter:image"
          content="https://rchat.acml.me/rchat-thumbnail.jpg"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, interactive-widget=resizes-content"
        />
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

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <MainLayout>{children}</MainLayout>
    </ThemeProvider>
  );
}

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_KEY),
  );
  const notificationSoundRef = useRef<HTMLAudioElement>(null);

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
    console.log(subscription);
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

  return (
    <>
      <audio hidden ref={notificationSoundRef}>
        <track kind="captions" />
        <source src="/sound/new-chat.wav" type="audio/mpeg" />
      </audio>
      <Toaster closeButton position="top-center" />
      <Outlet context={{ supabase, session, notificationSoundRef }} />
    </>
  );
}
