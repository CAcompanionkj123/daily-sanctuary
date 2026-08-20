import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, CalendarDays, Search, Settings, Clock, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { todayKey } from "@/lib/diary";
import { useProfile } from "@/hooks/useProfile";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const linkClass =
    "flex items-center gap-2 rounded-md px-3 py-2 font-sans text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";
  const activeProps = { className: `${linkClass} bg-accent text-accent-foreground` };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-1 px-4 py-2.5">
          <Link to="/" className="mr-3 font-display text-lg tracking-tight">
            Digital Diary
          </Link>
          <Link
            to="/day/$date"
            params={{ date: todayKey(profile?.timezone) }}
            className={linkClass}
            activeProps={activeProps}
          >
            <BookOpen className="h-4 w-4" aria-hidden /> Today
          </Link>
          <Link to="/calendar" className={linkClass} activeProps={activeProps}>
            <CalendarDays className="h-4 w-4" aria-hidden /> Calendar
          </Link>
          <Link to="/timeline" className={linkClass} activeProps={activeProps}>
            <Clock className="h-4 w-4" aria-hidden /> Timeline
          </Link>
          <Link to="/search" className={linkClass} activeProps={activeProps}>
            <Search className="h-4 w-4" aria-hidden /> Search
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <Link to="/settings" className={linkClass} activeProps={activeProps}>
              <Settings className="h-4 w-4" aria-hidden /> Settings
            </Link>
            <button onClick={signOut} className={linkClass} aria-label="Sign out">
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
