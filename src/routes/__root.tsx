import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/components/bloodlink/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="hero-bg flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel max-w-md rounded-[2rem] p-8 text-center">
        <h1 className="font-display text-7xl font-black text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-black text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground transition hover:-translate-y-0.5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const META_DESC =
  "BloodLink Kerala — find nearby blood donors, hospitals, and blood banks across Kerala through a fast, map-driven emergency platform.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BloodLink Kerala | Emergency Blood Donor Discovery" },
      { name: "description", content: META_DESC },
      { name: "author", content: "BloodLink Kerala" },
      { name: "theme-color", content: "#c9302c" },
      { property: "og:title", content: "BloodLink Kerala | Emergency Blood Donor Discovery" },
      { property: "og:description", content: META_DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BloodLink Kerala | Emergency Blood Donor Discovery" },
      { name: "twitter:description", content: META_DESC },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/SyMKjjXDDAN9x2ZZE4n3bCJxhyn1/social-images/social-1777375669594-ChatGPT_Image_Apr_28,_2026,_03_27_25_PM.webp",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/SyMKjjXDDAN9x2ZZE4n3bCJxhyn1/social-images/social-1777375669594-ChatGPT_Image_Apr_28,_2026,_03_27_25_PM.webp",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bloodlink-theme">
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="top-right" closeButton />
      </AuthProvider>
    </ThemeProvider>
  );
}
