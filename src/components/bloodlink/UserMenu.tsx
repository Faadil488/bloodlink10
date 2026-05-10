import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, User as UserIcon, Heart, Settings, LayoutDashboard, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "./AuthProvider";

const statusLabel: Record<string, string> = {
  available: "Available to donate",
  busy: "Busy",
  emergency: "Emergency available",
};

const statusDot: Record<string, string> = {
  available: "bg-success",
  busy: "bg-warning",
  emergency: "bg-primary",
};

export function UserMenu() {
  const { user, profile, donor, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  const name = profile?.full_name || user.email?.split("@")[0] || "Donor";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const status = donor?.status ?? "available";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 transition hover:-translate-y-0.5 hover:bg-secondary">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-bold leading-tight text-muted-foreground">Hello</span>
            <span className="block text-sm font-black leading-tight text-foreground">
              {name.split(" ")[0]}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt={name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-foreground">{name}</p>
              <p className="truncate text-xs font-semibold text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {donor?.blood_group && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-black text-primary-foreground">
                {donor.blood_group}
              </span>
            )}
            {donor?.district && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-foreground">
                {donor.district}
              </span>
            )}
            {donor && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs font-bold">
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
                {statusLabel[status]}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
          <UserIcon className="mr-2 h-4 w-4" /> My profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/dashboard", hash: "requests" })}>
          <Heart className="mr-2 h-4 w-4" /> My requests
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          Toggle theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            navigate({ to: "/" });
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
        <Link to="/login" className="hidden">link</Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
