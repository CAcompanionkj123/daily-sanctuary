import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { AppShell } from "@/components/AppShell";
import { useCalendarMonth } from "@/hooks/useDiary";
import { toDateKey } from "@/lib/diary";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Digital Diary" },
      { name: "description", content: "Revisit your Digital Diary entries from a calm monthly calendar." },
      { property: "og:title", content: "Calendar — Digital Diary" },
      { property: "og:description", content: "Revisit your daily pages month by month." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [month, setMonth] = useState(() => new Date());
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const { data } = useCalendarMonth(toDateKey(start), toDateKey(end));
  const entryDates = useMemo(() => new Set((data?.entries ?? []).map((entry) => entry.entry_date)), [data?.entries]);
  const [selected, setSelected] = useState<Date>();
  const selectedKey = selected ? toDateKey(selected) : null;

  return (
    <AppShell>
      <div className="page-in">
        <header className="mb-8">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground">Your year in pages</p>
          <h1 className="mt-2 text-4xl">Calendar</h1>
        </header>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,28rem)_1fr]">
          <section className="paper-sheet p-4 sm:p-6">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={setSelected}
              modifiers={{ written: Array.from(entryDates).map((key) => new Date(`${key}T12:00:00`)) }}
              modifiersClassNames={{ written: "font-semibold underline decoration-primary decoration-2 underline-offset-4" }}
            />
          </section>
          <section>
            <h2 className="text-2xl">{selectedKey ? "Selected day" : "This month"}</h2>
            {selectedKey && entryDates.has(selectedKey) ? (
              <Link to="/day/$date" params={{ date: selectedKey }} className="mt-4 block paper-sheet p-5 hover:shadow-lift">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">Open page</span>
                <p className="mt-2 font-serif text-xl">{new Date(`${selectedKey}T12:00:00`).toLocaleDateString(undefined, { dateStyle: "full" })}</p>
              </Link>
            ) : (
              <div className="mt-4 space-y-3">
                {(data?.entries ?? []).map((entry) => (
                  <Link key={entry.entry_date} to="/day/$date" params={{ date: entry.entry_date }} className="block border-b border-border py-3 hover:text-primary">
                    <span className="font-sans text-sm">{new Date(`${entry.entry_date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                    <span className="ml-3 font-serif text-lg">{entry.mood ? `${entry.mood} mood` : "A written day"}</span>
                  </Link>
                ))}
                {!data?.entries.length && <p className="font-sans text-sm text-muted-foreground">No pages written this month.</p>}
              </div>
            )}
          </section>
        </div>
        <div className="mt-10 flex items-center gap-2 font-sans text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" /> Underlined days have a page.</div>
      </div>
    </AppShell>
  );
}