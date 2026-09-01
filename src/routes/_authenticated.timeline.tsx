import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Star } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useEntries } from "@/hooks/useDiary";
import { excerpt, moodOf } from "@/lib/diary";

export const Route = createFileRoute("/_authenticated/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — Digital Diary" },
      {
        name: "description",
        content: "Browse the pages and memories in your Digital Diary timeline.",
      },
      { property: "og:title", content: "Timeline — Digital Diary" },
      { property: "og:description", content: "Browse your journal in chronological order." },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const { data, isPending } = useEntries({ pageSize: 50 });
  return (
    <AppShell>
      <div className="page-in mx-auto max-w-3xl">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground">
              The record
            </p>
            <h1 className="mt-2 text-4xl">Timeline</h1>
          </div>
          <Clock className="h-6 w-6 text-muted-foreground" />
        </header>
        <div className="space-y-1">
          {isPending && (
            <p className="font-sans text-sm text-muted-foreground">Gathering your pages…</p>
          )}
          {(data?.rows ?? []).map((entry) => {
            const mood = moodOf(entry.mood);
            return (
              <Link
                key={entry.id}
                to="/day/$date"
                params={{ date: entry.entry_date }}
                className="group block border-b border-border py-5 hover:bg-accent/30"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <time className="font-sans text-sm text-muted-foreground">
                    {new Date(`${entry.entry_date}T12:00:00`).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </time>
                  {entry.is_favorite && <Star className="h-4 w-4 fill-current text-primary" />}
                </div>
                <h2 className="mt-2 text-2xl group-hover:text-primary">
                  {entry.title || "Untitled day"}
                  {mood && <span className="ml-2 text-base">{mood.emoji}</span>}
                </h2>
                <p className="mt-1 font-serif text-lg text-muted-foreground">
                  {excerpt(entry.content) || "A quiet page, waiting for more."}
                </p>
              </Link>
            );
          })}
          {!isPending && !data?.rows.length && (
            <p className="font-serif text-xl text-muted-foreground">
              Your timeline begins with the first page you write.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
