import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, Compass, LogOut, Menu, Route, Settings, UserRound, Users, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT } from "@/i18n";
import { backend } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** The four sections from the group's brief, plus settings. */
function useNavItems(): NavItem[] {
  const t = useT();
  return [
    { to: "/app", label: t.app.nav.overview, icon: Compass },
    { to: "/app/education", label: t.app.nav.education, icon: BookOpen },
    { to: "/app/community", label: t.app.nav.community, icon: Users },
    { to: "/app/journeys", label: t.app.nav.journeys, icon: Route },
    { to: "/app/settings", label: t.app.nav.settings, icon: Settings },
  ];
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const items = useNavItems();
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={label}>
          <NavLink
            to={to}
            end={to === "/app"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
              )
            }
          >
            <Icon className="size-4.5" aria-hidden="true" />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function UserMenu() {
  const t = useT();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const initial = (profile?.displayName || user?.email || "?").charAt(0).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.app.userMenu}>
          <span className="grid size-9 place-items-center rounded-full bg-cta font-display font-bold text-cta-foreground" aria-hidden="true">
            {initial}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <span className="block text-sm text-foreground">{profile?.displayName}</span>
          <span className="block font-normal">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/app/settings")}>
          <UserRound /> {t.app.nav.settings}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async () => {
            await backend.signOut();
            navigate("/");
          }}
        >
          <LogOut /> {t.auth.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-[env(safe-area-inset-top,0px)] hidden h-dvh flex-col border-r bg-card px-4 pb-16 pt-5 lg:flex">
        <Logo to="/app" className="px-2" />
        <nav aria-label={t.nav.mainLabel} className="mt-8 flex-1 overflow-y-auto">
          <NavList />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-[env(safe-area-inset-top,0px)] z-30 flex h-16 items-center justify-between gap-2 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-1 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-expanded={open}
              aria-controls="app-mobile-nav"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X /> : <Menu />}
            </Button>
            <Logo to="/app" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        {open && (
          <nav id="app-mobile-nav" aria-label={t.nav.mainLabel} className="border-b bg-card p-3 lg:hidden">
            <NavList onNavigate={() => setOpen(false)} />
          </nav>
        )}
        <main id="main" className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
