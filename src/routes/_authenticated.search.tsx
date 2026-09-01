import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useDiary";
import { excerpt } from "@/lib/diary";

export const Route = createFileRoute("/_authenticated/search")({
  head: () => ({
    meta: [
      { title: "Search — Digital Diary" },
      {
        name: "description",
        content: "Find a memory, thought or task in your private Digital Diary.",
      },
      { property: "og:title", content: "Search — Digital Diary" },
      { property: "og:description", content: "Find anything across your journal." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [term, setTerm] = useState("");
  const { data, isFetching } = useSearch(term);
  return (
    <AppShell>
      <div className="page-in mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Look back
          </p>
          <h1 className="mt-2 text-4xl">Search your diary</h1>
        </header>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Try a word, feeling or place…"
            aria-label="Search diary"
            className="h-11 pl-10"
          />
        </div>
        <div className="mt-8 space-y-5">
          {isFetching && (
            <p className="font-sans text-sm text-muted-foreground">Looking through your pages…</p>
          )}
          {(data?.entries ?? []).map((entry) => (
            <Link
              key={entry.id}
              to="/day/$date"
              params={{ date: entry.entry_date }}
              className="block border-b border-border pb-5 hover:text-primary"
            >
              <time className="font-sans text-sm text-muted-foreground">{entry.entry_date}</time>
              <h2 className="mt-1 text-2xl">{entry.title || "Untitled day"}</h2>
              <p className="mt-1 font-serif text-lg text-muted-foreground">
                {excerpt(entry.content)}
              </p>
            </Link>
          ))}
          {(data?.tasks ?? []).map((task) => (
            <div key={task.id} className="border-b border-border pb-5">
              <span className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Task
              </span>
              <p className="mt-1 font-serif text-xl">{task.title}</p>
            </div>
          ))}
          {term.trim().length > 1 &&
            !isFetching &&
            !data?.entries.length &&
            !data?.tasks.length && (
              <p className="font-serif text-xl text-muted-foreground">
                Nothing found for “{term}”.
              </p>
            )}
        </div>
      </div>
    </AppShell>
  );
}
