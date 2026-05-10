import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Droplets, Menu, ShieldCheck, X, Mail, Github } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { UserMenu } from "./UserMenu";
import { NotificationsBell } from "./NotificationsBell";

const navItems = [
  { to: "/search", label: "Find donors" },
  { to: "/sos", label: "SOS" },
  { to: "/register", label: "Donate" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="BloodLink Kerala home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform group-hover:-translate-y-0.5">
            <Droplets className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-black tracking-tight text-foreground sm:text-lg">
              BloodLink
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Kerala
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3.5 py-2 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              activeProps={{
                className:
                  "rounded-full px-3.5 py-2 text-sm font-bold bg-secondary text-foreground",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/sos"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 sm:inline-flex"
          >
            Emergency SOS
          </Link>
          {user ? (
            <>
              <NotificationsBell />
              <UserMenu />
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:-translate-y-0.5 hover:bg-secondary"
            >
              Login
            </Link>
          )}
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background/95 px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-bold text-foreground hover:bg-secondary"
              activeProps={{
                className: "block rounded-xl px-3 py-2.5 text-sm font-bold bg-secondary text-foreground",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2.5 font-display text-lg font-black text-foreground">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Droplets className="h-5 w-5" />
            </span>
            BloodLink Kerala
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Emergency Blood Donor Discovery Platform for Kerala — connecting families, donors,
            hospitals, and blood banks when every minute matters.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-foreground">
            Explore
          </h2>
          <ul className="space-y-2 text-sm font-semibold text-muted-foreground">
            <li><Link to="/search" className="hover:text-foreground">Find donors</Link></li>
            <li><Link to="/sos" className="hover:text-foreground">Emergency SOS</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Become a donor</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-foreground">
            Trust
          </h2>
          <div className="space-y-2 text-sm font-semibold text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Verified records</div>
            <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Emergency-first</div>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-foreground">
            Contact
          </h2>
          <div className="space-y-2 text-sm font-semibold text-muted-foreground">
            <a href="mailto:hello@bloodlink.kerala" className="flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" /> hello@bloodlink.kerala
            </a>
            <a href="https://github.com" className="flex items-center gap-2 hover:text-foreground">
              <Github className="h-4 w-4" /> Open source
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-4 text-center text-xs font-bold text-muted-foreground sm:px-6 lg:px-8">
        © {new Date().getFullYear()} BloodLink Kerala — Built for the community.
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
