import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Lock, Sparkles, CalendarDays } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { todayKey } from "@/lib/diary";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Diary — a quiet place to write" },
      {
        name: "description",
        content:
          "Digital Diary is a private, paper-inspired journal: daily pages, moods, gratitude, plans and a calendar of your year.",
      },
      { property: "og:title", content: "Digital Diary — a quiet place to write" },
      {
        property: "og:description",
        content: "A private, paper-inspired journal for daily entries, moods, gratitude and plans.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { session, loading } = useAuth();
  const signedIn = !!session;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="page-in">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Digital Diary
        </p>
        <h1 className="mt-6 text-5xl leading-tight font-normal tracking-tight sm:text-6xl">
          A quiet page,
          <br />
          waiting for today.
        </h1>
        <p className="mt-6 max-w-xl font-serif text-2xl leading-relaxed text-muted-foreground">
          Write your day, note how it felt, keep what you're grateful for, and plan what's next —
          all on soft paper that only you can read.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {signedIn ? (
            <Link
              to="/day/$date"
              params={{ date: todayKey() }}
              className="rounded-md bg-primary px-6 py-3 font-sans text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open today's page
            </Link>
          ) : (
            <Link
              to="/auth"
              className="rounded-md bg-primary px-6 py-3 font-sans text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {loading ? "Start writing" : "Start writing"}
            </Link>
          )}
          <Link
            to="/auth"
            className="rounded-md border border-border px-6 py-3 font-sans text-sm transition-colors hover:bg-accent"
          >
            {signedIn ? "Account" : "Sign in"}
          </Link>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2">
          {[
            { icon: BookOpen, title: "Distraction-free pages", body: "One day, one page. Just ink on paper." },
            { icon: Sparkles, title: "Mood & gratitude", body: "A gentle record of how life actually feels." },
            { icon: CalendarDays, title: "Calendar & timeline", body: "See your months fill up, revisit any day." },
            { icon: Lock, title: "Private by design", body: "Row-level security means your pages are yours alone." },
          ].map(({ icon: Icon, title, body }) => (
            <li key={title} className="paper-sheet p-5">
              <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
              <h2 className="mt-3 text-lg">{title}</h2>
              <p className="mt-1 font-sans text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
