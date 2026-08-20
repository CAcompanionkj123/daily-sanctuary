import { useEffect, useState } from "react";
import { useGratitude, useSaveGratitude } from "@/hooks/useDiary";
import { Input } from "@/components/ui/input";

export function GratitudeBox({ entryId }: { entryId: string | null | undefined }) {
  const { data } = useGratitude(entryId);
  const save = useSaveGratitude(entryId);
  const [values, setValues] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    if (!data) return;
    const next = ["", "", ""];
    data.forEach((g) => {
      if (g.position >= 0 && g.position < 3) next[g.position] = g.content;
    });
    setValues(next);
  }, [data]);

  return (
    <section className="paper-sheet p-6">
      <h2 className="text-xl">Three good things</h2>
      <p className="mt-1 font-sans text-xs text-muted-foreground">
        {entryId ? "Small or large — anything counts." : "Write your page first to add gratitude."}
      </p>
      <ol className="mt-4 space-y-3">
        {values.map((v, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="font-serif text-lg text-muted-foreground">{i + 1}.</span>
            <Input
              value={v}
              disabled={!entryId}
              placeholder="I'm grateful for…"
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                setValues(next);
              }}
              onBlur={() => entryId && save.mutate({ position: i, content: v })}
              className="write-serif text-lg"
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
